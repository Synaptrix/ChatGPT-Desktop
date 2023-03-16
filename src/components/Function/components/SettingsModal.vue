<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import ShortcutKey from './ShortcutKey.vue'

defineProps<{ visible: boolean; setVisible: () => void }>()

const { apiKey, autoStart } = storeToRefs(useSettingsStore())
</script>

<template>
  <a-modal
    title="设置"
    simple
    hide-cancel
    :visible="visible"
    :mask-closable="false"
    :mask-style="{
      borderRadius: '0.75rem'
    }"
    @ok="setVisible"
  >
    <div class="flex flex-col gap-8">
      <div class="flex gap-2">
        <a-checkbox v-model="autoStart">开机自启动</a-checkbox>
        <a-checkbox>隐藏菜单栏图标</a-checkbox>
      </div>

      <!-- 热键绑定 -->
      <ShortcutKey />

      <a-input-password
        v-model="apiKey"
        class="w-full"
        placeholder="API Key"
        allow-clear
      />
    </div>
  </a-modal>
</template>
