<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import MarkdownItHighlight from 'markdown-it-highlightjs'
import MarkdownItCodeCopy from 'markdown-it-code-copy'
import { IconImage } from '@arco-design/web-vue/es/icon'
import { saveImage } from '@/utils'
import { useSettingsStore, useSessionStore, useRoleStore } from '@/stores'

const marked = new MarkdownIt().use(MarkdownItHighlight).use(MarkdownItCodeCopy)

const { uuid } = storeToRefs(useSettingsStore())
const { sessionDataList } = storeToRefs(useSessionStore())
const { currentRole } = storeToRefs(useRoleStore())

const sessionElement = ref<HTMLDivElement | null>(null)

watchEffect(() => {
  if (!sessionElement.value) return

  if (sessionDataList.value.at(-1)?.message?.content) {
    sessionElement.value.scrollTo({
      top: sessionElement.value.offsetHeight
    })
  }
})
</script>

<template>
  <!-- TODO: 复制，一键发送，导出图片-->
  <div ref="sessionElement" class="session flex-1 cursor-default overflow-auto">
    <template v-if="sessionDataList.length">
      <div
        :id="`session-${item.id}`"
        class="flex items-start gap-4 py-2 px-4"
        v-for="item in sessionDataList"
        :key="item.time"
      >
        <Avatar class="w-12!" :value="item.is_ask ? uuid : currentRole?.name" />
        <div
          class="group relative flex flex-1 flex-col gap-3.5 py-[11.5px] leading-6"
          :key="item.id"
        >
          <div
            class="text-5 absolute top-2 right-2 opacity-0 transition group-hover:opacity-100"
          >
            <IconImage
              class="cursor-pointer"
              @click="saveImage(`session-${item.id}`)"
            />
          </div>
          <div
            v-html="marked.render(item.message.content)"
            :class="!item.message.content && 'blink-block'"
          ></div>
        </div>
      </div>
    </template>

    <!-- 当前无会话 -->
    <NoSession v-else />
  </div>
</template>

<style scoped lang="scss">
.session {
  .blink-block::after {
    animation: blink 1s infinite;
    @apply absolute h-6 w-1 bg-[var(--color-text-2)] content-none;
  }

  ::v-deep(.markdown-it-code-copy) {
    width: 20px;
    height: 20px;

    border: 0;
    outline: 0;
    background: url('@/assets/image/copy.svg') no-repeat center;
    background-size: contain;
  }

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
