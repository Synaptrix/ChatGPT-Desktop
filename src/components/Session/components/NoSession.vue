<script setup lang="ts">
import { useSettingsStore } from '@/stores'

const { shortcutKey } = storeToRefs(useSettingsStore())
</script>

<template>
  <div class="text-5 flex h-full flex-col items-center justify-center gap-4">
    <!-- 唤醒窗口 -->
    <span>
      <template v-for="(item, index) of shortcutKey" :key="index">
        <a-typography-text code>{{ item }}</a-typography-text>
        <template v-if="index < shortcutKey.length - 1"> + </template>
      </template>
      唤醒窗口
    </span>
    <!-- 换行 -->
    <span>
      <a-typography-text code>Shift</a-typography-text> +
      <a-typography-text code>Enter</a-typography-text> 换行
    </span>
    <!-- 发送消息 -->
    <span><a-typography-text code>Enter</a-typography-text> 发送消息</span>
  </div>
</template>
