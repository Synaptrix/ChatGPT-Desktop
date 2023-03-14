<script setup lang="ts">
import { IconSettings } from '@arco-design/web-vue/es/icon'
</script>

<template>
  <a-popover trigger="click" position="tr" content-class="p-4 leading-none">
    <a-tooltip content="设置" position="tr">
      <IconSettings />
    </a-tooltip>

    <template #content>
      <div class="flex flex-col gap-4">
        <a-checkbox>开机自启动</a-checkbox>
        <a-checkbox>隐藏菜单栏图标</a-checkbox>

        <a-input-password placeholder="API Key" allow-clear />
      </div>
    </template>
  </a-popover>
</template>

<style scoped lang="scss"></style>
