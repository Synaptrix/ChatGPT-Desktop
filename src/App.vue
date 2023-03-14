<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { register } from '@tauri-apps/api/globalShortcut'
import { initSQL } from '@/sqls'
import {
  useThemeStore,
  useUuidStore,
  useRecordStore,
  useRoleStore,
  useFixedStore
} from '@/stores'

initSQL()

const { themeClass } = storeToRefs(useThemeStore())
const { uuid } = storeToRefs(useUuidStore())
const { currentRecord, recordList } = storeToRefs(useRecordStore())
const { currentRole } = storeToRefs(useRoleStore())
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
    <div class="text-7 fixed top-2 right-2 flex gap-2">
      <Theme />

      <Fixed />
    </div>

    <div class="flex-1 cursor-default overflow-auto">
      <!-- <div v-for="(item, index) of recordList.slice(1)" :key="index">
          <Avatar :value="!(index % 2) ? uuid : undefined" />
        </div> -->
      <template v-if="currentRecord">
        <div class="py-2" v-for="item in 100" :key="item">
          {{ item }}
        </div>
      </template>

      <!-- 无对话内容 -->
      <div
        class="text-5 flex h-full flex-col items-center justify-center gap-4"
        v-else
      >
        <span>↩ 发送消息</span>
        <span>⇧ + ↩︎ 或者 ⌃ + ↩︎ 或者 ⌥ + ↩︎ 换行</span>
      </div>
    </div>

    <div class="flex cursor-default flex-col gap-2 pt-2">
      <div class="text-6 relative flex justify-end gap-4">
        <div class="text-4 left-50% top-50% -translate-1/2 absolute">
          正在与 <span class="mark">{{ currentRole?.name }}</span> 对话
        </div>

        <!-- TODO: 没有必要全部拆分，待功能完善将不必要的拆分直接挪到这边 -->
        <Increase />

        <ReAnswer />

        <Delete />

        <History />

        <Settings />
      </div>

      <Input />
    </div>
  </div>
</template>
