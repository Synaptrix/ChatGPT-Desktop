<script setup lang="ts">
const settingsStore = useSettingsStore()
const { toggleTheme } = settingsStore
const { themeMode, autoStart, isRememberPosition, proxy, showTime } =
  storeToRefs(settingsStore)

const relaunch = () => {
  window.location.reload()
}
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
        @change="(value: any) => toggleTheme(value)"
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
      <i>显示对话时间:</i>
      <a-switch v-model="showTime" type="round" />
    </li>

    <li>
      <i>开启代理:</i>
      <a-switch v-model="proxy.bypass" type="round"></a-switch>

      <span class="text-sm text-[var(--color-text-3)]">
        代理信息变化后，请点击<span
          class="mark cursor-pointer"
          @click="relaunch"
          >重启</span
        >确保正常工作
      </span>
    </li>

    <li v-show="proxy.bypass">
      <i>代理地址:</i>
      <a-input v-model="proxy.url" placeholder="代理地址"></a-input>
    </li>

    <div
      class="flex justify-end text-sm text-[var(--color-text-3)]"
      v-show="proxy.bypass"
    >
      示例：https://chatgpt.proxy.com<span class="mark">/api</span>
    </div>
  </ul>
</template>

<style scoped lang="scss">
.general {
  li {
    --uno: flex items-center gap-3;
    > i {
      --uno: cursor-default min-w-50 text-right not-italic
        text-[var(--color-text-2)];
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
