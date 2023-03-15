<script setup lang="ts">
import { Icon } from '@arco-design/web-vue'
import { IconCloseCircleFill } from '@arco-design/web-vue/es/icon'
import { useShortcutKeyStore } from '@/stores'
import { hotkeys, isHotKey, getKeyIcon, getKeySymbol } from '@/utils'

const IconFont = Icon.addFromIconFontCn({
  src: import.meta.env.VITE_ICON_FONT_URL
})

const { shortcutKey, setupComplete } = storeToRefs(useShortcutKeyStore())

const lastShortcutKey = computed(() => shortcutKey.value.at(-1) || '')

const focused = ref(false)

const handleKeydown = (event: KeyboardEvent) => {
  // key 只用在四个热键，code 用于其他的键
  const { key, code } = event

  // 不管大写锁定键
  if (code === 'CapsLock' || setupComplete.value) return

  // 双击热键或同时按住两个相同的热键
  if (shortcutKey.value.includes(key) && isHotKey(key)) {
    shortcutKey.value.push(key)

    setupComplete.value = true
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
      shortcutKey.value.push(getKeySymbol(code) || code)
    }

    // 至少存在一个热键，并且保证有一个除热键之外的键
    setupComplete.value =
      shortcutKey.value.some((item) => isHotKey(item)) &&
      shortcutKey.value.some((item) => !isHotKey(item))
  }
}

const handleKeyup = (event: KeyboardEvent) => {
  if (setupComplete.value) return

  if (isHotKey(event.key)) {
    setTimeout(() => {
      if (setupComplete.value) return

      shortcutKey.value = []
    }, 150)
  } else {
    shortcutKey.value = []
  }
}

const handleClear = () => {
  shortcutKey.value = []
  setupComplete.value = false
}
</script>
<!-- TODO:热键绑定高度会有跳动，更换整体图标 -->
<template>
  <div class="flex items-center gap-2">
    <span>唤醒窗口：</span>
    <div
      tabindex="0"
      class="text-5 flex flex-1 cursor-pointer items-center justify-between rounded border border-solid border-[var(--color-fill-2)] bg-[var(--color-fill-2)] p-2 outline-none transition"
      :class="[focused ? 'border-[rgb(var(--primary-5))]!' : '']"
      @focus="focused = true"
      @blur="focused = false"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
    >
      <div class="flex items-center gap-2 text-[var(--color-text-4)]">
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
          v-if="setupComplete"
        >
          <template v-if="shortcutKey[0] === shortcutKey[1]">
            double tap
          </template>

          <template v-else-if="getKeyIcon(lastShortcutKey)">
            <IconFont :type="getKeyIcon(lastShortcutKey)" />
          </template>

          <template v-else>
            {{ lastShortcutKey }}
          </template>
        </span>
      </div>

      <IconCloseCircleFill
        class="text-[var(--color-text-3)]"
        v-if="setupComplete"
        @click="handleClear"
      />
    </div>
  </div>
</template>
