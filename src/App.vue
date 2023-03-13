<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { IconHistory } from '@arco-design/web-vue/es/icon'
import { initSQL } from '@/sqls'
import {
  useThemeStore,
  useUuidStore,
  useRecordStore,
  useFixedStore
} from '@/stores'

initSQL()

const { themeClass } = storeToRefs(useThemeStore())
const { uuid } = storeToRefs(useUuidStore())
const { recordList } = storeToRefs(useRecordStore())
const { isFix } = storeToRefs(useFixedStore())

const borderClass = ref('bordered')

onMounted(async () => {
  // 监听窗口有无获取焦点
  appWindow.onFocusChanged(({ payload }) => {
    if (!payload) {
      if (isFix.value) {
        borderClass.value = 'bordered-transparent'
      } else {
        // appWindow.hide()
      }
    } else {
      borderClass.value = 'bordered'
    }
  })
})
</script>

<template>
  <div
    class="app relative flex h-screen flex-col overflow-hidden rounded-xl"
    :class="[themeClass, borderClass]"
  >
    <div class="text-6 fixed top-4 right-4 flex flex-col gap-4">
      <!-- 历史记录 -->
      <IconHistory />
      <!-- 主题切换 -->
      <Theme />
      <!-- 窗口固定 -->
      <Fixed />
    </div>

    <!-- 内容区 -->
    <ul class="flex-1 cursor-move overflow-auto p-4" data-tauri-drag-region>
      <!-- <li v-for="(item, index) of recordList.slice(1)" :key="index">
          <Avatar :value="!(index % 2) ? uuid : undefined" />
        </li> -->
      <li class="cursor-auto py-2" v-for="item in 100" :key="item">
        {{ item }}
      </li>
    </ul>

    <!-- 输入框 -->
    <Input />
  </div>
</template>

<style scoped lang="scss">
.app {
  &::before,
  &::after {
    @apply -z-1 absolute top-0 right-0 bottom-0 left-0 bg-inherit blur-xl content-none;
  }
}
</style>
