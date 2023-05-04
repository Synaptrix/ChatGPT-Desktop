<script setup lang="ts">
const { shortcutKeys } = storeToRefs(useSettingsStore())
</script>

<template>
  <div class="text-5 flex h-full flex-col items-center justify-center gap-4">
    <!-- 唤醒窗口 -->
    <span>
      <template v-for="(item, index) of shortcutKeys" :key="index">
        <a-typography-text code>{{ item }}</a-typography-text>
        <template v-if="index < shortcutKeys.length - 1"> + </template>
      </template>
      {{ $t('session.empty.wakeUp') }}
    </span>
    <!-- 换行 -->
    <span>
      <a-typography-text code>Shift</a-typography-text> +
      <a-typography-text code>Enter</a-typography-text>
      {{ $t('session.empty.wrap') }}
    </span>
    <!-- 发送消息 -->
    <span
      ><a-typography-text code>Enter</a-typography-text>
      {{ $t('session.empty.send') }}</span
    >

    <span>
      <i18n-t keypath="session.empty.role" tag="label" scope="global">
        <a-typography-text code>/</a-typography-text>
      </i18n-t>
    </span>
  </div>
</template>
