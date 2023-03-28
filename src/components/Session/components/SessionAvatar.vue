<script lang="ts" setup>
import type { SessionData } from '@/types'
import { estimateTokens } from '@/utils'
import { ImageCost } from '@/constants'

const props = defineProps<{
  data: SessionData
}>()
const { currentRole } = storeToRefs(useRoleStore())
const { uuid, isTokenUsage } = storeToRefs(useSettingsStore())
const { sessionDataList, currentSession } = storeToRefs(useSessionStore())

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
      return `${roleToken + contentToken + memoryToken}TK${
        data.is_memory ? '*' : ''
      }`
    }

    return `${contentToken}TK`
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
    // return `${num * ImageCost[size]}TK`
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-1">
    <Avatar class="w-12!" :value="data.is_ask ? uuid : currentRole?.name" />
    <span class="text-gray text-xs" v-if="isTokenUsage">
      {{ calcToken(data) }}
    </span>
  </div>
</template>
