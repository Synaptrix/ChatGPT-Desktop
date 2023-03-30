<script setup lang="ts">
import { getVersion, getName, getTauriVersion } from '@tauri-apps/api/app'
import { type, arch, platform, version } from '@tauri-apps/api/os'
import { writeText } from '@tauri-apps/api/clipboard'
import { emit } from '@tauri-apps/api/event'

const appInfo = reactive({
  appName: '',
  appVersion: '',
  tauriVersion: '',
  platform: '',
  os: '',
  osVersion: '',
  arch: ''
})

const contributors = ref<any[]>([])

const copyInfo = async () => {
  const info = {
    ...appInfo,
    userAgent: navigator.userAgent
  }

  await writeText('软件以及系统信息如下：' + JSON.stringify(info))

  Message.success('复制成功')
}

const copyQQGroup = () => {
  writeText('473033518')

  Message.success('群号已复制，无法跳转则自行添加')
}

onMounted(async () => {
  appInfo.appName = await getName()
  appInfo.appVersion = await getVersion()
  appInfo.tauriVersion = await getTauriVersion()
  appInfo.platform = await platform()
  appInfo.os = await type()
  appInfo.osVersion = await version()
  appInfo.arch = await arch()

  contributors.value = (await getContributorsApi()) || []
})
</script>

<template>
  <a-row>
    <a-col :span="10" class="flex flex-col items-center gap-3 leading-none">
      <div class="w-[100px]">
        <img
          src="@/assets/image/logo.png"
          class="scale-120 w-full"
          alt="logo"
        />
      </div>

      <span>{{ appInfo.appName }}</span>

      <div class="flex items-center gap-2 text-[var(--color-text-2)]">
        <span> v{{ appInfo.appVersion }} </span>
        <a-tooltip content="检查更新" mini>
          <icon-refresh
            class="text-5 transition-300 cursor-pointer hover:text-[rgb(var(--primary-6))]"
            @click="emit('update-app')"
          />
        </a-tooltip>
      </div>

      <a-tooltip content="复制软件以及系统信息" mini>
        <a class="cursor-pointer" @click="copyInfo">复制信息</a>
      </a-tooltip>

      <a-tooltip content="请务必提供复制的信息" mini position="bottom">
        <a
          class="text-[var(--color-text-3)]"
          href="https://github.com/ChatGPT-Desktop/ChatGPT-Desktop/issues/new"
        >
          问题反馈
        </a>
      </a-tooltip>
    </a-col>
    <a-col :span="14" class="flex flex-col gap-3">
      <span>仓库地址</span>
      <a
        href="https://github.com/ChatGPT-Desktop/ChatGPT-Desktop"
        class="flex items-center gap-2"
      >
        <img src="@/assets/image/github.svg" />
        github
      </a>

      <span>官方社区</span>
      <div class="flex gap-3">
        <a href="https://discord.gg/jg4waryfA6" class="flex items-center gap-2">
          <img src="@/assets/image/discord.svg" />
          Discord
        </a>
        <a
          href="https://qm.qq.com/cgi-bin/qm/qr?k=vhU6EACVQqfxoXlVKAWCBE_dXH_qpxn2&jump_from=webapi&authKey=YTGKMbApCUrmxHWV0te4NFBWbN7YQViDrTZPH8zIdIzZLgs4xLQhcKxgaCFwqSx2"
          class="flex items-center gap-2"
          @click="copyQQGroup"
        >
          <img src="@/assets/image/qq.png" width="32" />
          QQ群
        </a>
      </div>

      <div class="flex flex-col gap-3" v-if="contributors.length">
        <span>贡献者</span>
        <div class="max-h-30 flex flex-col gap-3 overflow-auto">
          <a
            v-for="item in contributors"
            class="flex items-center gap-2"
            :href="item.html_url"
            :key="item.id"
          >
            <img
              width="32"
              class="rounded-full"
              :src="item.avatar_url"
              :alt="item.login"
            />
            {{ item.login }}
          </a>
        </div>
      </div>
    </a-col>
  </a-row>
</template>
