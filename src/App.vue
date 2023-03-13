<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { initSQL } from '@/sqls'
import { useThemeStore, useUuidStore, useRecordStore } from '@/stores'

initSQL()

const { themeClass } = storeToRefs(useThemeStore())
const { uuid } = storeToRefs(useUuidStore())
const { recordList } = storeToRefs(useRecordStore())

const borderClass = ref('bordered')

onMounted(async () => {
  // 监听窗口有无获取焦点
  appWindow.onFocusChanged(({ payload }) => {
    if (!payload) {
      // appWindow.hide()
      borderClass.value = 'bordered-transparent'
    } else {
      borderClass.value = 'bordered'
    }
  })
})
</script>

<template>
  <Suspense>
    <div
      class="app relative flex h-screen flex-col overflow-hidden rounded-xl"
      :class="[themeClass, borderClass]"
    >
      <div class="fixed top-4 right-4">
        <!-- 主题切换 -->
        <Theme />
      </div>

      <!-- 内容区 -->
      <ul class="flex-1 cursor-move overflow-auto p-4" data-tauri-drag-region>
        <!-- <li v-for="(item, index) of recordList.slice(1)" :key="index">
          <Avatar :value="!(index % 2) ? uuid : undefined" />
        </li> -->
        <li class="cursor-auto" v-for="item in 100" :key="item">
          {{ item }}
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
    @apply -z-1 absolute top-0 right-0 bottom-0 left-0 bg-inherit blur-xl content-none;
  }
}
</style>
