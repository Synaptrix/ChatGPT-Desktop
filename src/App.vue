<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import Theme from './components/Theme/index.vue'
import Avatar from './components/Avatar/index.vue'
import { useThemeStore, useUuidStore } from '@/stores'
import { initSQL } from '@/sqls'

const { themeClass } = storeToRefs(useThemeStore())
const { uuid } = storeToRefs(useUuidStore())

const borderClass = ref('')

onMounted(async () => {
  initSQL()

  // 监听窗口有无获取焦点
  appWindow.onFocusChanged(({ payload }) => {
    if (payload) {
      borderClass.value = 'border border-[var(--border-color)] border-solid'
    } else {
      borderClass.value = ''
    }
  })
})
</script>

<template>
  <div
    class="app relative h-screen overflow-hidden rounded-xl"
    :class="[themeClass, borderClass]"
  >
    <Theme />

    <!-- 内容区 -->
    <div class="h-[calc(100%-48px)]" data-tauri-drag-region>
      <Avatar />
      <Avatar :value="uuid" />
    </div>

    <!-- 输入框 -->
    <div
      class="border-t-solid fixed bottom-0 w-full border border-[var(--border-color)]"
    >
      <input
        type="text"
        placeholder="输入问题并回车..."
        class="input input-ghost outline-0! border-0! bg-opacity-0! w-full"
      />
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
