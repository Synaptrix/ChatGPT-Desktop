<script setup lang="ts">
import {
  checkUpdate as tauriCheckUpdate,
  installUpdate,
  onUpdaterEvent
} from '@tauri-apps/api/updater'
import { getVersion } from '@tauri-apps/api/app'
import { relaunch } from '@tauri-apps/api/process'
import { listen } from '@tauri-apps/api/event'

const { modalMaskStyle } = useModalStyle()

const visible = ref(false)

const isDownload = ref(false)

const updateManifest = ref<any>({})

const unListen = ref(NOOP)

const checkUpdate = async (hideMessage = true) => {
  try {
    const updateInfo = await tauriCheckUpdate()

    if (!updateInfo?.manifest) {
      if (!hideMessage) return Message.error('获取新版本失败，请稍后重试')
    }

    if (!updateInfo.shouldUpdate) throw new Error()

    updateManifest.value = {
      ...updateInfo?.manifest,
      currentVersion: await getVersion()
    }

    visible.value = true

    return true
  } catch (error) {
    if (hideMessage) return

    Message.success('当前已是最新版本')
  }
}

const handleBeforeOk = (done: any) => {
  ;(async () => {
    isDownload.value = true

    installUpdate()

    unListen.value = await onUpdaterEvent(({ status }) => {
      switch (status) {
        case 'DONE':
          Message.success('更新成功，即将重启')
          handleCancel()
          relaunch()
          break

        case 'ERROR':
          Message.error('网络似乎出了问题，请稍后重试')
          done(false)
          handleCancel(true)
          break
      }
    })
  })()
}

const handleCancel = (value = false) => {
  visible.value = value
  unListen.value()
  isDownload.value = false
}

onMounted(() => {
  checkUpdate()

  listen('update-app', () => checkUpdate(false))

  setInterval(checkUpdate, 1000 * 60 * 60 * 24)
})
</script>

<template>
  <a-modal
    :visible="visible"
    simple
    title="发现新版本可用 🥳"
    :mask-style="modalMaskStyle"
    :ok-text="isDownload ? '正在更新' : '立即更新'"
    :cancel-text="isDownload ? '取消更新' : '稍后更新'"
    :mask-closable="false"
    :esc-to-close="false"
    @before-ok="handleBeforeOk"
    @cancel="handleCancel"
  >
    <div class="flex flex-col gap-4">
      <span
        >更新版本：v{{ updateManifest.currentVersion }} 👉
        <span class="mark">v{{ updateManifest.version }}</span></span
      >
      <span>更新时间：{{ getLocalTime(updateManifest.date) }}</span>
      <span
        >更新详情：<a
          href="https://github.com/Synaptrix/ChatGPT-Desktop/releases/latest"
          >Github</a
        ></span
      >
    </div>
  </a-modal>
</template>
