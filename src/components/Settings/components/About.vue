<script setup lang="ts">
import { getVersion } from '@tauri-apps/api/app'

const version = ref('')

const contributors = ref<any[]>([])

onMounted(async () => {
  version.value = await getVersion()

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
      <span>ChatGPT-Desktop</span>
      <span>v{{ version }}</span>
      <a class="cursor-pointer">复制电脑信息</a>
      <a href="https://github.com/ChatGPT-Desktop/ChatGPT-Desktop/issues/new">
        BUG 反馈
      </a>
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
      <div>
        <a href="https://discord.gg/jg4waryfA6" class="flex items-center gap-2">
          <img src="@/assets/image/discord.svg" />
          Discord
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
