<script lang="ts" setup>
import MarkdownIt from 'markdown-it'
import MarkdownItHighlight from 'markdown-it-highlightjs'
import { emit } from '@tauri-apps/api/event'
import type { SessionData } from '@/types'

const props = defineProps<{ data: SessionData }>()

const store = useSessionStore()
const { currentSession } = storeToRefs(store)
const { deleteSessionData } = store

const imageSpan = computed(() => {
  if (props.data.message_type === 'image') {
    switch (props.data.message.content.length) {
      case 1:
        return 24

      case 2:
        return 12

      case 3:
        return 8

      case 4:
        return 6
    }
  }
})

const marked = new MarkdownIt({
  linkify: true
})
  .use(MarkdownItHighlight, {
    register: {
      vue: () => {
        return {
          name: 'vue',
          subLanguage: ['html', 'xml', 'javascript', 'css']
        }
      }
    }
  })
  .use(copyCode)

const position = computed(() => (props.data.is_ask ? 'left' : 'right'))
</script>

<template>
  <div class="session-data group relative max-w-fit" id="session-item">
    <div
      class="operation transition-300 absolute flex flex-col gap-1 opacity-0 group-hover:opacity-100"
      :class="
        data.is_ask
          ? 'left-0 -translate-x-full pr-2'
          : 'right-0 translate-x-full pl-2'
      "
    >
      <template v-if="data.message_type === 'text'">
        <a-tooltip content="复制" :position="position">
          <div
            class="copy"
            :id="`copy-${data.id}`"
            @click="
              copyText($event, {
                content: data.message.content?.prompt || data.message.content
              })
            "
          ></div>
        </a-tooltip>

        <a-popover class="session-data-download-popover" :position="position">
          <icon-download />

          <template #content>
            <a-tooltip content="导出 Markdown">
              <div
                class="markdown"
                @click="saveMarkdown(data.message.content)"
              ></div>
            </a-tooltip>

            <a-tooltip content="导出图片">
              <icon-image @click="saveImage(`session-data-${data.id}`)" />
            </a-tooltip>
          </template>
        </a-popover>
      </template>

      <a-tooltip content="删除" :position="position">
        <icon-delete @click="deleteSessionData(data)" />
      </a-tooltip>
    </div>

    <div
      :id="`session-content-${data.id}`"
      class="session-content flex flex-col gap-4 rounded-md p-4"
      v-html="marked.render(data.message.content)"
      :class="[
        data.is_ask
          ? 'bg-[rgb(var(--primary-6))] text-white'
          : 'bg-[var(--session-background)]',
        data.is_ask ? 'session-content--ask' : 'session-content--answer'
      ]"
      v-if="currentSession?.type === 'text'"
    ></div>

    <div
      :id="`session-content-${data.id}`"
      class="session-content flex flex-col gap-4 rounded-md p-4"
      v-html="marked.render(data.message.content.prompt)"
      :class="[
        data.is_ask
          ? 'bg-[rgb(var(--primary-6))] text-white'
          : 'bg-[var(--session-background)]',
        data.is_ask ? 'session-content--ask' : 'session-content--answer'
      ]"
      v-else-if="
        currentSession?.type === 'image' && data.message_type === 'text'
      "
    ></div>

    <a-row class="-m-1" v-else>
      <a-col
        class="w-[221px] p-1"
        :span="imageSpan"
        v-for="(img, index) in data.message.content"
        :key="index"
      >
        <div class="group/image text-0 relative w-full">
          <img
            :src="`data:image/png;base64,${img.b64_json}`"
            class="w-full"
            @load="emit('scroll-to-bottom')"
          />
          <div
            class="transition-300 absolute top-0 flex h-full w-full items-center justify-center gap-6 bg-black/50 opacity-0 group-hover/image:opacity-100"
          >
            <icon-download
              class="text-10 cursor-pointer text-white opacity-70 hover:opacity-100"
              @click="saveImageFromFile(img.file)"
            />
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss">
@import './index.scss';
</style>
