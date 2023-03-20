<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import ShortcutKey from './ShortcutKey.vue'

defineProps<{ visible: boolean; setVisible: () => void }>()

const { apiKey, autoStart, isMemory } = storeToRefs(useSettingsStore())
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
        <!-- <a-checkbox>隐藏菜单栏图标</a-checkbox> -->
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
    </div>
  </a-modal>
</template>
