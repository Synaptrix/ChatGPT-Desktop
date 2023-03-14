<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { register } from '@tauri-apps/api/globalShortcut'
import {
  useThemeStore,
  useUuidStore,
  useRecordStore,
  useRoleStore,
  useFixedStore
} from '@/stores'

// TODO: 首次加载有问题，获取不到初始化的角色列表

const { themeClass } = storeToRefs(useThemeStore())
const { uuid } = storeToRefs(useUuidStore())
const { currentRecord } = storeToRefs(useRecordStore())
const { currentRole } = storeToRefs(useRoleStore())
const { isFix } = storeToRefs(useFixedStore())

const windowFocused = ref(true)

onMounted(async () => {
  // 监听窗口有无获取焦点
  appWindow.onFocusChanged(({ payload }) => {
    if (!payload && !isFix.value) appWindow.hide()

    windowFocused.value = payload
  })
  // 快捷键开启窗口
  register('Alt+X', () => {
    appWindow.setFocus()
  })
})
</script>
<!-- TODO:颜色与 ui 的调整 -->
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
      <!-- TODO: 角色如何与历史对话绑定 -->
      <template v-if="currentRecord">
        <div
          class="flex items-start p-2"
          v-for="(item, index) of currentRecord.data?.slice(1)"
          :key="index"
        >
          <Avatar
            class="w-14!"
            :value="!(index % 2) ? uuid : currentRole?.name"
          />
          <div>
            {{ item.content }}
          </div>
        </div>
      </template>

      <!-- 无对话内容 -->
      <div
        class="text-5 flex h-full flex-col items-center justify-center gap-4"
        v-else
      >
        <!-- TODO: 丰富此处信息 -->
        <span>
          <a-typography-text code>Alt</a-typography-text> +
          <a-typography-text code>X</a-typography-text> 唤醒窗口
        </span>
        <span
          ><a-typography-text code>Shift</a-typography-text> +
          <a-typography-text code>Enter</a-typography-text> 发送消息
        </span>
        <span><a-typography-text code>Enter</a-typography-text> 换行</span>
      </div>
    </div>

    <div class="flex cursor-default flex-col gap-2 pt-2">
      <div class="text-6 relative flex justify-end gap-4">
        <div class="text-4 left-50% top-50% -translate-1/2 absolute">
          正在与 <span class="mark">{{ currentRole?.name }}</span> 对话
        </div>

        <!-- TODO: 没有必要全部拆分，待功能完善将不必要的拆分直接挪到这边或者移步到一个组件即可 -->
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
