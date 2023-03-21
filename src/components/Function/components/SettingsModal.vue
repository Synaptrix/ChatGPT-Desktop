<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import ShortcutKey from './ShortcutKey.vue'
import { getOpenAICreditApi } from '@/api'

const props = defineProps<{ visible: boolean; setVisible: () => void }>()

const { apiKey, autoStart, isMemory, isRememberPosition } = storeToRefs(
  useSettingsStore()
)

const totalCredit = ref(0)
const usedCredit = ref(0)

const getCredit = async () => {
  const credit = await getOpenAICreditApi()
  if (!credit) return

  totalCredit.value = parseFloat(credit.total_granted.toFixed(2))
  usedCredit.value = parseFloat(credit.total_available.toFixed(2))
}

// TODO 优化，这里可能需要防抖
watch(apiKey, getCredit)

watch(
  () => props.visible,
  (val) => {
    val && getCredit()
  }
)
</script>

<template>
  <a-modal
    title="设置"
    simple
    hide-cancel
    :visible="visible"
    :mask-style="{
      borderRadius: '0.75rem'
    }"
    @ok="setVisible"
    @cancel="setVisible"
  >
    <div class="flex flex-col gap-6">
      <div class="flex gap-2">
        <a-checkbox v-model="autoStart">开机自启动</a-checkbox>
        <a-checkbox v-model="isRememberPosition">记住上次窗口位置</a-checkbox>
      </div>

      <!-- 热键绑定 -->
      <ShortcutKey />

      <div class="flex items-end gap-2">
        <a-checkbox v-model="isMemory">记忆对话</a-checkbox>
        <span class="text-3 text-[var(--color-text-3)]">
          开启连续对话，将加倍消耗 Token
        </span>
      </div>

      <a-input-password
        v-model="apiKey"
        class="w-full"
        placeholder="API Key"
        allow-clear
      />
      <p class="text-3 text-right text-[var(--color-text-3)]" v-if="apiKey">
        账户余额&dollar; {{ usedCredit }} / {{ totalCredit }}
      </p>
    </div>
  </a-modal>
</template>
