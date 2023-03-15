<script setup lang="ts">
defineProps<{ visible: boolean; setVisible: () => void }>()
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
    <div class="flex flex-col gap-4">
      <a-checkbox>开机自启动</a-checkbox>
      <a-checkbox>隐藏菜单栏图标</a-checkbox>

      <a-input-password class="w-full" placeholder="API Key" allow-clear />
    </div>
  </a-modal>
</template>

<style scoped lang="scss"></style>
