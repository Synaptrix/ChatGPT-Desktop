<script setup lang="ts">
import type { MessageType } from '@/types'

const sessionStore = useSessionStore()
const { switchSession } = sessionStore
const { isThinking, currentSession, imageParams } = storeToRefs(sessionStore)

const handleSelect = async (value: MessageType | any) => {
  await switchSession()
  currentSession.value!.type = value
}
</script>

<template>
  <a-popover v-if="currentSession?.type === 'image'">
    <a-button type="text" :disabled="isThinking">
      <template #icon>
        <icon-tool />
      </template>
    </a-button>
    <template #content>
      <div class="flex flex-col gap-2">
        <div class="flex items-center">
          <span>图片尺寸：</span>
          <a-radio-group v-model="imageParams.size" type="button">
            <a-radio value="256x256">256</a-radio>
            <a-radio value="512x512">512</a-radio>
            <a-radio value="1024x1024">1024</a-radio>
          </a-radio-group>
        </div>
        <div class="flex items-center">
          <span>图片数量：</span>
          <a-radio-group
            v-model="imageParams.number"
            type="button"
            class="w-[168px] justify-between"
          >
            <a-radio :value="1">1</a-radio>
            <a-radio :value="2">2</a-radio>
            <a-radio :value="3">3</a-radio>
            <a-radio :value="4">4</a-radio>
          </a-radio-group>
        </div>
      </div>
    </template>
  </a-popover>

  <a-dropdown trigger="hover" @select="handleSelect">
    <a-button type="text" :disabled="isThinking">
      <template #icon>
        <icon-plus-circle />
      </template>
    </a-button>
    <template #content>
      <a-doption value="text">文本模式</a-doption>
      <a-doption value="image">图像模式</a-doption>
    </template>
  </a-dropdown>
</template>
