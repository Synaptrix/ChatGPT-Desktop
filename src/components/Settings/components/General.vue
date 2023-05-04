<script setup lang="ts">
const settingsStore = useSettingsStore()
const { toggleTheme, setLanguage } = settingsStore
const { themeMode, autoStart, isRememberPosition, proxy, currentLang } =
  storeToRefs(settingsStore)

const relaunch = () => {
  window.location.reload()
}
</script>

<template>
  <ul class="general flex flex-col gap-4">
    <li>
      <i>{{ $t('setting.general.language') }}:</i>
      <a-radio-group
        v-model="currentLang"
        type="button"
        size="large"
        @change="(value: any) => setLanguage(value)"
      >
        <a-radio value="zh">
          <icon-chinese-fill />
        </a-radio>
        <a-radio value="en">
          <icon-english-fill />
        </a-radio>
        <a-radio value="es">
          <Es />
        </a-radio>
      </a-radio-group>
    </li>

    <li>
      <i>{{ $t('setting.general.theme') }}:</i>
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
      <i>{{ $t('setting.general.wakeUp') }}:</i>
      <ShortcutKey />
    </li>

    <li>
      <i>{{ $t('setting.general.autoStart') }}:</i>
      <a-switch v-model="autoStart" type="round" size="medium" />
    </li>

    <li>
      <i>{{ $t('setting.general.keepPosition') }}:</i>
      <a-switch v-model="isRememberPosition" type="round" />
    </li>

    <li>
      <i>{{ $t('setting.general.proxy') }}:</i>
      <a-switch v-model="proxy.bypass" type="round"></a-switch>

      <span class="text-sm text-[var(--color-text-3)]" v-if="proxy.bypass">
        <i18n-t
          keypath="setting.general.proxyTip"
          tag="label"
          for="restart"
          scope="global"
        >
          <span class="mark cursor-pointer" @click="relaunch">{{
            $t('setting.general.restart')
          }}</span>
        </i18n-t>
      </span>
    </li>

    <li v-show="proxy.bypass">
      <i>{{ $t('setting.general.proxyAddress') }}:</i>
      <a-input
        v-model="proxy.url"
        :placeholder="$t('setting.general.proxyAddress')"
      ></a-input>
    </li>

    <div
      class="flex justify-end text-sm text-[var(--color-text-3)]"
      v-show="proxy.bypass"
    >
      {{ $t('setting.general.example') }}：https://chatgpt.proxy.com<span
        class="mark"
        >/api</span
      >
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
