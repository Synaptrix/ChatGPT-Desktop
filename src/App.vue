<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import Theme from './components/Theme/index.vue'
import Avatar from './components/Avatar/index.vue'
import Input from './components/Input/index.vue'
import { useThemeStore, useUuidStore, useRecordStore } from '@/stores'
import { initSQL } from '@/sqls'

const { themeClass } = storeToRefs(useThemeStore())
const { uuid } = storeToRefs(useUuidStore())
const { recordList } = storeToRefs(useRecordStore())

onMounted(async () => {
  initSQL()

  // 监听窗口有无获取焦点
  appWindow.onFocusChanged(({ payload }) => {
    // if (!payload) appWindow.minimize()
  })
})
</script>

<template>
  <Suspense>
    <div
      class="app relative h-screen overflow-hidden rounded-xl border border-solid border-[var(--border-color)]"
      :class="themeClass"
    >
      <Theme />

      <!-- 内容区 -->
      <ul
        class="flex h-[calc(100%-48px)] flex-col gap-4 overflow-auto p-4"
        data-tauri-drag-region
      >
        <li v-for="(item, index) of recordList" :key="index">
          <Avatar :value="!(index % 2) ? uuid : undefined" />
        </li>
      </ul>

      <!-- 输入框 -->
      <Input />
    </div>
  </Suspense>
</template>

<style scoped lang="scss">
.app {
  &::before,
  &::after {
    background: inherit;
    @apply -z-1 absolute top-0 right-0 bottom-0 left-0 blur-xl content-none;
  }
}
</style>
