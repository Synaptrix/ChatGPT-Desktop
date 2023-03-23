<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { type } from '@tauri-apps/api/os'
import { useShortcuts } from './hooks/useShortcuts'

const { isFix, windowFocused } = storeToRefs(useSettingsStore())

const isLoading = ref(true)

const windowClass = ref('')

const handleDoubleClick = () => {
  isFix.value = !isFix.value
}

onMounted(async () => {
  await initSQL()

  isLoading.value = false

  useObserverLink()

  // 禁用默认浏览器快捷键
  useDisableShortcuts()
  // 启用应用内专属快捷键
  useShortcuts()
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
    const platformName = await type()

    if (platformName !== 'Darwin') {
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
    <a-tooltip :content="isFix ? '双击取消固定' : '双击固定窗口'">
      <div
        class="z-999 transition-300 fixed top-2 left-1/2 h-3 w-80 -translate-x-1/2 cursor-move rounded-md opacity-0 hover:opacity-100"
        :class="isFix ? 'bg-gray' : 'bg-gray/50'"
        data-tauri-drag-region
        @dblclick="handleDoubleClick"
      ></div>
    </a-tooltip>

    <div class="flex h-full items-center justify-center" v-if="isLoading">
      <a-spin :size="50" :loading="true" />
    </div>

    <template v-else>
      <div class="text-7 z-999 fixed top-2 left-2 flex flex-col gap-2">
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
