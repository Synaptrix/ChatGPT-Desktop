<script setup lang="ts">
const { shortcutKeys, isBinding } = storeToRefs(useSettingsStore())

// 获取最后一位快捷键
const lastShortcutKey = computed(() => getLastItem(shortcutKeys.value) || '')

// 绑定快捷键的元素
const bindingElement = ref<HTMLElement | null>(null)

// 键盘按下事件
const handleKeydown = (event: KeyboardEvent) => {
  // key 只用在四个热键，code 用于其他的键
  const { key, code } = event
  const keyName = key === 'Meta' ? 'Command' : key
  const codeName = isSpecialKey(code) ? code : getKeySymbol(code)!

  // 不管大写锁定键
  if (codeName === 'CapsLock' || shortcutKeys.value.includes(keyName)) return

  // 追加热键
  if (isHotKey(keyName)) {
    // 如果最后一位是热键，就继续追加，反之添加到最前面
    if (isHotKey(lastShortcutKey.value)) {
      shortcutKeys.value.push(keyName)
    } else {
      shortcutKeys.value.unshift(keyName)
    }
  } else {
    if (shortcutKeys.value.includes(codeName)) return

    shortcutKeys.value.push(codeName)
  }

  // 至少存在一个热键，并且保证有一个除热键之外的键
  const leastOne = shortcutKeys.value.some((item) => isHotKey(item))
  const noEvery = shortcutKeys.value.every((item) => isHotKey(item))
  if (leastOne && !noEvery) {
    bindingElement.value?.blur()
  }
}

// 键盘弹起事件
const handleKeyup = () => {
  if (!isBinding.value) return

  shortcutKeys.value = []
}
</script>

<template>
  <div
    ref="bindingElement"
    tabindex="0"
    class="transition-300 max-w-50 flex flex-1 cursor-pointer items-center justify-between rounded border border-solid border-[var(--color-fill-2)] bg-[var(--color-fill-2)] p-2 outline-none"
    :class="[isBinding ? 'border-[rgb(var(--primary-5))]!' : '']"
    @focus="isBinding = true"
    @blur="isBinding = false"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <div
      class="text-6 flex items-center gap-2 font-sans font-bold leading-none text-[var(--color-text-4)]"
    >
      <!-- 热键 -->
      <span
        v-for="(item, index) of hotkeys"
        :class="[
          shortcutKeys.includes(item.key) && 'text-[rgb(var(--primary-5))]'
        ]"
        :key="index"
      >
        {{ item.symbol }}
      </span>

      <span class="pl-2 text-[rgb(var(--primary-5))]" v-if="!isBinding">
        <!-- 特殊键 -->
        <template v-if="isSpecialKey(lastShortcutKey)">
          {{ getKeySymbol(lastShortcutKey) }}
        </template>

        <!-- 普通键 -->
        <template v-else>
          {{ lastShortcutKey }}
        </template>
      </span>
    </div>
  </div>
</template>
