<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { initSQL } from '@/sqls'
import { useSettingsStore, useSessionStore, useRoleStore } from '@/stores'

// TODO: 首次加载有问题，获取不到初始化的角色列表
initSQL()

const { themeClass, isFix, shortcutKey } = storeToRefs(useSettingsStore())
const { currentSession } = storeToRefs(useSessionStore())
const { currentRole } = storeToRefs(useRoleStore())

const windowFocused = ref(true)

onMounted(async () => {
  // 监听窗口有无获取焦点
  appWindow.onFocusChanged(({ payload }) => {
    if (!payload && !isFix.value) appWindow.hide()

    windowFocused.value = payload
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
      <template v-if="currentSession">
        123132
        <!-- <div
          class="flex p-2 items-start"
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
        </div> -->
      </template>

      <!-- 无对话内容 -->
      <div
        class="text-5 flex h-full flex-col items-center justify-center gap-4"
        v-else
      >
        <!-- TODO: 丰富此处信息 -->
        <span>
          <template v-for="(item, index) of shortcutKey" :key="index">
            <a-typography-text code>{{ item }}</a-typography-text>
            <template v-if="index < shortcutKey.length - 1"> + </template>
          </template>
          唤醒窗口
        </span>
        <span
          ><a-typography-text code>Shift</a-typography-text> +
          <a-typography-text code>Enter</a-typography-text> 换行
        </span>
        <span><a-typography-text code>Enter</a-typography-text> 发送消息</span>
      </div>
    </div>

    <div class="flex cursor-default flex-col gap-2 pt-2">
      <div class="text-6 relative flex justify-end gap-4">
        <div class="top-50% left-50% text-4 -translate-1/2 absolute">
          正在与 <span class="mark">{{ currentRole?.name }}</span> 对话
        </div>

        <Function />
      </div>

      <Input />
    </div>
  </div>
</template>
