<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { register } from '@tauri-apps/api/globalShortcut'
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

const windowFocused = ref(true)

onMounted(async () => {
  // 监听窗口有无获取焦点
  appWindow.onFocusChanged(({ payload }) => {
    if (!isFix.value) appWindow.hide()

    windowFocused.value = payload
  })
  // 快捷键开启窗口
  register('Alt+X', () => {
    appWindow.setFocus()
  })
})
</script>

<template>
  <div
    class="frosted flex h-screen cursor-move flex-col overflow-hidden rounded-xl p-2"
    :class="[themeClass, windowFocused ? 'bordered' : 'bordered-transparent']"
    data-tauri-drag-region
  >
    <div class="text-6 fixed top-2 right-2 flex gap-2">
      <Theme />

      <Fixed />
    </div>

    <ul class="flex-1 cursor-default overflow-auto">
      <!-- <li v-for="(item, index) of recordList.slice(1)" :key="index">
          <Avatar :value="!(index % 2) ? uuid : undefined" />
        </li> -->
      <li class="py-2" v-for="item in 100" :key="item">
        {{ item }}
      </li>
    </ul>

    <div class="flex cursor-default flex-col gap-2 pt-2">
      <div class="text-5 flex w-full justify-end gap-4">
        <Refresh />

        <Delete />

        <History />

        <Settings />
      </div>

      <Input />
    </div>
  </div>
</template>
