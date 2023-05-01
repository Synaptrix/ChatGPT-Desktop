<script lang="ts" setup>
import type { SessionData } from '@/types'

defineProps<{ data: SessionData }>()
const roleStore = useRoleStore()
const { updateRole } = roleStore
const { currentRole } = storeToRefs(roleStore)
const { uuid, isTokenUsage, tokenUnit } = storeToRefs(useSettingsStore())
const { sessionDataList, currentSession } = storeToRefs(useSessionStore())

const { modalMaskStyle } = useModalStyle()

const visible = ref(false)
const prevRoleInfo = ref<any>()

const handleOK = () => {
  visible.value = false
  updateRole()
}

const handleCancel = () => {
  visible.value = false

  currentRole.value = prevRoleInfo.value
  updateRole(prevRoleInfo.value)
}

/**
 * 计算单条消息消耗的token
 * @param data 单条消息
 */
const calcToken = (data: SessionData) => {
  if (!currentRole.value) return ''

  if (currentSession.value?.type === 'text') {
    // 角色描述字符数
    const roleToken = estimateTokens(currentRole.value!.description)
    // 消息内容字符数
    const contentToken = estimateTokens(data.message.content)
    // 记忆模式下额外消耗的字符数
    let memoryToken = 0
    if (data.is_memory) {
      // 获取sessionDataList中的此条之前的最后5条消息
      const memoryList = sessionDataList.value
        .filter((memo) => memo.id! < data.id!)
        .slice(-5)
      memoryToken = estimateTokens(
        memoryList.map((memo) => memo.message.content).join('')
      )
    }

    if (data.is_ask) {
      const token = roleToken + contentToken + memoryToken

      return `${tokenUnit.value === 'TK' ? token : Number(token.toFixed(3))}${
        tokenUnit.value
      }${data.is_memory ? '*' : ''}`
    }

    return contentToken + tokenUnit.value
  }

  if (currentSession.value?.type === 'image') {
    return
    // const { message, message_type } = props.data
    // if (message_type !== 'image') return '0TK'
    // // 计算图片的 token * 数量
    // const num = message.content.length
    // // TODO 通过base64获得图片的大小
    // const size = calcImageSize(message.content[0].b64_json)
    // if (!size) return '0TK'
    // return `${num * IMAGE_COST[size]}TK`
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-1">
    <Avatar class="w-13!" :value="uuid" v-if="data.is_ask" />

    <a-tooltip :content="$t('session.tip.editRole')" position="tl" v-else>
      <Avatar
        class="w-13! cursor-pointer"
        :value="currentRole?.name"
        @click="visible = true"
      />
    </a-tooltip>

    <span
      class="text-gray w-13! whitespace-nowrap text-center text-xs"
      v-if="isTokenUsage"
    >
      {{ calcToken(data) }}
    </span>

    <a-modal
      :visible="visible"
      simple
      :width="500"
      :mask-style="modalMaskStyle"
      :mask-closable="false"
      :esc-to-close="false"
      unmount-on-close
      @before-open="prevRoleInfo = { ...currentRole }"
      @ok="handleOK"
      @cancel="handleCancel"
      :ok-text="$t('common.confirm')"
      :cancel-text="$t('common.cancel')"
      v-if="currentRole"
    >
      <a-space direction="vertical" fill size="large">
        <a-row>
          <a-col :span="6">
            <span class="leading-[32px]">
              {{ $t('session.editRole.name') }}
            </span>
          </a-col>
          <a-col :span="18"><a-input v-model="currentRole.name" /></a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <span class="leading-[32px]">
              {{ $t('session.editRole.description') }}
            </span>
          </a-col>
          <a-col :span="18">
            <a-textarea
              v-model="currentRole.description"
              :auto-size="{
                minRows: 1,
                maxRows: 5
              }"
            />
          </a-col>
        </a-row>
      </a-space>
    </a-modal>
  </div>
</template>
