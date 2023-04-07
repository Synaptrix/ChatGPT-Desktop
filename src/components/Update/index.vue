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

const { t } = useI18n()

const visible = ref(false)

const isDownload = ref(false)

const updateManifest = ref<any>({})

const unListen = ref(NOOP)

const checkUpdate = async (hideMessage = true) => {
  try {
    const updateInfo = await tauriCheckUpdate()

    if (!updateInfo?.manifest) {
      if (!hideMessage)
        return Message.error(t('message.getTheLatestVersionFail'))
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

    Message.success(t('message.alreadyTheLatestVersion'))
  }
}

const handleBeforeOk = (done: any) => {
  ;(async () => {
    isDownload.value = true

    installUpdate()

    unListen.value = await onUpdaterEvent(({ status }) => {
      switch (status) {
        case 'DONE':
          Message.success(t('message.updateSuccess'))
          handleCancel()
          relaunch()
          break

        case 'ERROR':
          Message.error(t('message.networkError'))
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
    :title="$t('setting.about.version.newVersion')"
    :mask-style="modalMaskStyle"
    :ok-text="
      isDownload
        ? $t('setting.about.version.updating')
        : $t('setting.about.version.updateNow')
    "
    :cancel-text="
      isDownload
        ? $t('setting.about.version.cancelUpdate')
        : $t('setting.about.version.updateLater')
    "
    :mask-closable="false"
    :esc-to-close="false"
    @before-ok="handleBeforeOk"
    @cancel="handleCancel"
  >
    <div class="flex flex-col gap-4">
      <span
        >{{
          $t('setting.about.version.updateVersion', [
            updateManifest.currentVersion
          ])
        }}
        <span class="mark">{{
          $t('setting.about.version.version', [updateManifest.version])
        }}</span></span
      >
      <span>{{
        $t('setting.about.version.updateTime', [
          getLocalTime(updateManifest.date)
        ])
      }}</span>
      <span
        >{{ $t('setting.about.version.detail')
        }}<a href="https://github.com/Synaptrix/ChatGPT-Desktop/releases/latest"
          >Github</a
        ></span
      >
    </div>
  </a-modal>
</template>
