<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { platform } from '@tauri-apps/api/os'
import { initSQL } from '@/sqls'
import { useSessionStore, useSettingsStore } from '@/stores'
import { useObserverLink } from '@/hooks'

const { isFix, windowFocused } = storeToRefs(useSettingsStore())

const isLoading = ref(true)

const windowClass = ref('')

onMounted(async () => {
  await initSQL()

  isLoading.value = false

  useObserverLink()

  appWindow.onFocusChanged(({ payload }) => {
    windowFocused.value = payload

    setTimeout(() => {
      if (!windowFocused.value && !isFix.value) appWindow.hide()
    }, 100)
  })

  if (import.meta.env.PROD) {
    document.addEventListener('contextmenu', function (event) {
      if (!window.getSelection()?.toString()) {
        event.preventDefault()
      }
    })
  }
})

watch(
  windowFocused,
  async (newValue) => {
    const platformName = await platform()

    if (platformName !== 'darwin') {
      windowClass.value = 'bordered'
    } else {
      let className = 'rounded-xl '
      className += newValue ? 'bordered' : 'bordered-transparent'

      windowClass.value = className
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    class="frosted flex h-screen flex-col overflow-hidden p-2"
    :class="[windowClass]"
  >
    <div
      class="bg-gray/60 z-999 transition-300 fixed top-2 left-1/2 h-3 w-80 -translate-x-1/2 cursor-move rounded-md opacity-0 hover:opacity-100"
      data-tauri-drag-region
    ></div>

    <div class="flex h-full items-center justify-center" v-if="isLoading">
      <a-spin :size="50" :loading="true" />
    </div>

    <template v-else>
      <div class="text-7 z-999 fixed top-2 left-2 flex flex-col gap-2">
        <!-- 固定窗口 -->
        <Fixed />
        <!-- 主题切换 -->
        <Theme />
      </div>

      <!-- 会话信息 -->
      <Session />

      <div class="flex cursor-default flex-col gap-2 pt-2">
        <!-- 功能区域 -->
        <Function />
        <!-- 输入框 -->
        <Input />
      </div>
    </template>
  </div>
</template>
