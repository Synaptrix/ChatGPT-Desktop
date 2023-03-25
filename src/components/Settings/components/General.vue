<script setup lang="ts">
const settingsStore = useSettingsStore()
const { toggleTheme } = settingsStore
const { themeMode, autoStart, isRememberPosition, proxyUrl } =
  storeToRefs(settingsStore)
</script>

<template>
  <ul class="general flex flex-col gap-4">
    <li>
      <i>唤醒窗口:</i>
      <ShortcutKey />
    </li>

    <li>
      <i>主题:</i>
      <a-radio-group
        v-model="themeMode"
        type="button"
        size="large"
        @change="toggleTheme"
      >
        <a-radio value="light">
          <icon-sun />
        </a-radio>
        <a-radio value="dark">
          <icon-moon />
        </a-radio>
        <a-radio value="system">
          <icon-desktop />
        </a-radio>
      </a-radio-group>
    </li>

    <li>
      <i>开机自启动:</i>
      <a-switch v-model="autoStart" type="round" size="medium" />
    </li>

    <li>
      <i>记住窗口上次位置:</i>
      <a-switch v-model="isRememberPosition" type="round" />
    </li>

    <li>
      <i>URL转发:</i>
      <a-input v-model="proxyUrl"></a-input>
    </li>

    <div class="flex justify-end text-sm text-[var(--color-text-3)]">
      示例：https://chatgpt.proxy.com<span class="mark">/api</span>
    </div>
  </ul>
</template>

<style scoped lang="scss">
.general {
  li {
    --uno: flex items-center gap-3;
    > i {
      --uno: min-w-50 text-right not-italic text-[var(--color-text-2)];
    }
    ::v-deep(.arco-radio-button-content) {
      --uno: flex h-[30px] items-center;
      .arco-icon {
        --uno: text-6;
      }
    }
  }
}
</style>
