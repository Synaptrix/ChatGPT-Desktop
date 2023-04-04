<script setup lang="ts">
import { sep } from '@tauri-apps/api/path'
import type { SessionData } from '@/types'

const { isThinking, sessionDataList, currentSession } = storeToRefs(
  useSessionStore()
)
const { currentRole } = storeToRefs(useRoleStore())

const disabled = computed(
  () => isThinking.value || !sessionDataList.value.length
)

const getRoleName = (item: SessionData) => {
  const name = item.is_ask ? '你' : currentRole.value?.name

  return name + '：'
}

const getMDContent = async (item: SessionData) => {
  let content = ''

  const { message, message_type } = item

  if (currentSession.value?.type === 'text') {
    content = message.content
  } else {
    if (message_type === 'text') {
      content = message.content.prompt
    } else {
      for (const image of message.content) {
        const imageName = await saveImageFromFile(image.file, true)

        content += `\n![图片](.${sep}markdown-images${sep}${imageName})`
      }
    }
  }

  return getRoleName(item) + content + '\n\n'
}

const handleSelect = async (value: string) => {
  if (value === 'image') {
    saveImage('session-list')
  } else if (value === 'markdown') {
    let mdResult = ''

    for await (const item of sessionDataList.value) {
      mdResult += await getMDContent(item)
    }

    saveMarkdown(mdResult)
  }
}
</script>

<template>
  <a-dropdown
    trigger="hover"
    @select="(value: any) => handleSelect(value)"
    position="top"
  >
    <a-button type="text" :disabled="disabled">
      <template #icon>
        <icon-download />
      </template>
    </a-button>
    <template #content>
      <a-doption value="image">导出图片</a-doption>
      <a-doption value="markdown"> 导出 Markdown </a-doption>
    </template>
  </a-dropdown>
</template>
