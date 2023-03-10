<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import Theme from './components/Theme/index.vue'
import Avatar from './components/Avatar/index.vue'
import { useThemeStore, useUuidStore, useRecordStore } from '@/stores'
import { initSQL } from '@/sqls'

const { themeClass } = storeToRefs(useThemeStore())
const { uuid } = storeToRefs(useUuidStore())
const { recordList } = storeToRefs(useRecordStore())

onMounted(async () => {
  initSQL()

  // 监听窗口有无获取焦点
  appWindow.onFocusChanged(({ payload }) => {
    if (!payload) appWindow.minimize()
  })
})
</script>

<template>
  <div
    class="app relative h-screen overflow-hidden rounded-xl border border-solid border-[var(--border-color)]"
    :class="themeClass"
  >
    <Theme />

    <!-- 内容区 -->
    <ul class="flex h-[calc(100%-48px)] flex-col gap-4 overflow-auto p-4">
      <li
        v-for="(item, index) of recordList"
        :key="index"
        data-tauri-drag-region
      >
        <Avatar :value="!(index % 2) ? uuid : undefined" />
      </li>
    </ul>

    <!-- 输入框 -->
    <div
      class="border-t-solid fixed bottom-0 w-full border border-[var(--border-color)]"
    >
      <input
        type="text"
        placeholder="输入问题并回车..."
        class="input input-ghost outline-0! border-0! bg-opacity-0! pr-13! w-full"
      />
      <i
        class="i-carbon-recently-viewed top-50% absolute right-3 h-6 w-6 -translate-y-1/2 cursor-pointer"
      ></i>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app {
  &::before,
  &::after {
    @apply -z-1 absolute top-0 left-0 right-0 bottom-0 bg-inherit blur-xl content-none;
  }
}
</style>
