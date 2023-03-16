<script setup lang="ts">
import { Icon } from '@arco-design/web-vue'
import { useSettingsStore } from '@/stores'
import { hotkeys, isHotKey, getKeyIcon, getKeySymbol } from '@/utils'

const IconFont = Icon.addFromIconFontCn({
  src: import.meta.env.VITE_ICON_FONT_URL
})

const { shortcutKey, isBinding } = storeToRefs(useSettingsStore())
// 获取最后一位快捷键
const lastShortcutKey = computed(() => shortcutKey.value.at(-1) || '')
// 绑定快捷键的元素
const bindingElement = ref<HTMLElement | null>(null)
// 获取焦点事件
const handleFocus = () => {
  shortcutKey.value = []
  isBinding.value = true
}
// 键盘按下事件
const handleKeydown = (event: KeyboardEvent) => {
  // key 只用在四个热键，code 用于其他的键
  const { key, code } = event

  // 不管大写锁定键
  if (code === 'CapsLock') return

  // 双击热键或同时按住两个相同的热键
  if (shortcutKey.value.includes(key) && isHotKey(key)) {
    shortcutKey.value.push(key)

    bindingElement.value?.blur()
  } else {
    // 追加热键
    if (isHotKey(key)) {
      // 如果最后一位是热键，就继续追加，反之添加到最前面
      if (isHotKey(lastShortcutKey.value)) {
        shortcutKey.value.push(key)
      } else {
        shortcutKey.value.unshift(key)
      }
    } else {
      const codeName = getKeySymbol(code) || code

      if (shortcutKey.value.includes(codeName)) return

      shortcutKey.value.push(codeName)
    }

    // 至少存在一个热键，并且保证有一个除热键之外的键
    const leastOne = shortcutKey.value.some((item) => isHotKey(item))
    const noEvery = shortcutKey.value.every((item) => isHotKey(item))
    if (leastOne && !noEvery) {
      bindingElement.value?.blur()
    }
  }
}
// 键盘弹起事件
const handleKeyup = (event: KeyboardEvent) => {
  if (!isBinding.value) return

  if (isHotKey(event.key)) {
    setTimeout(() => {
      if (!isBinding.value) return

      shortcutKey.value = []
    }, 300)
  } else {
    shortcutKey.value = []
  }
}
</script>
<!-- TODO:热键绑定高度会有跳动，更换整体图标 -->
<template>
  <div class="flex items-center gap-2">
    <span>唤醒窗口：</span>
    <div
      ref="bindingElement"
      tabindex="0"
      class="text-5 flex flex-1 cursor-pointer items-center justify-between rounded border border-solid border-[var(--color-fill-2)] bg-[var(--color-fill-2)] p-2 outline-none transition"
      :class="[isBinding ? 'border-[rgb(var(--primary-5))]!' : '']"
      @focus="handleFocus"
      @blur="isBinding = false"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
    >
      <div class="flex items-center gap-2 text-[var(--color-text-4)]">
        <!-- 热键 -->
        <IconFont
          v-for="item in hotkeys"
          :type="item.icon"
          :class="[
            shortcutKey.includes(item.code) && 'text-[rgb(var(--primary-5))]'
          ]"
          :key="item.code"
        />

        <span
          class="pl-2 leading-none text-[rgb(var(--primary-5))]"
          v-if="!isBinding"
        >
          <!-- 双🐔键 -->
          <template v-if="shortcutKey[0] === shortcutKey[1]">
            double tap
          </template>
          <!-- 特殊有图标的键 -->
          <template v-else-if="getKeyIcon(lastShortcutKey)">
            <IconFont :type="getKeyIcon(lastShortcutKey)" />
          </template>
          <!-- 普通键 -->
          <template v-else>
            {{ lastShortcutKey }}
          </template>
        </span>
      </div>
    </div>
  </div>
</template>
