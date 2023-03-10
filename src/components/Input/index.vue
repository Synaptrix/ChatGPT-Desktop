<script lang="ts" setup>
import { IconHistory } from '@arco-design/web-vue/es/icon'
</script>

<template>
  <div
    class="border-t-solid fixed bottom-0 w-full border border-[var(--border-color)]"
  >
    <a-input
      class="input input-ghost bg-opacity-0! border-0! outline-0! pr-13! w-full"
      placeholder="选择角色, 输入问题, 开始探索..."
      allow-clear
    >
      <template #prefix>
        <RoleList />
      </template>
      <template #suffix>
        <icon-history
          class="top-50% absolute right-3 h-7 w-7 -translate-y-1/2 cursor-pointer"
        />
      </template>
    </a-input>
  </div>
</template>

<style lang="scss" scoped></style>
