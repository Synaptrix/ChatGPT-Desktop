<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import MarkdownItHighlight from 'markdown-it-highlightjs'
import { useSettingsStore, useSessionStore, useRoleStore } from '@/stores'

const marked = new MarkdownIt({ html: true }).use(MarkdownItHighlight)

const { uuid } = storeToRefs(useSettingsStore())
const { currentSession, sessionDataList } = storeToRefs(useSessionStore())
const { currentRole } = storeToRefs(useRoleStore())
</script>

<template>
  <!-- TODO: 复制，一键发送，导出图片-->
  <div class="session flex-1 cursor-default overflow-auto">
    <template v-if="sessionDataList.length">
      <div
        class="flex items-start gap-4 py-2 px-4"
        v-for="item in sessionDataList"
        :key="item.time"
      >
        <Avatar class="w-12!" :value="item.is_ask ? uuid : currentRole?.name" />
        <div
          class="relative flex flex-1 flex-col gap-3.5 py-[11.5px] leading-6"
          v-html="marked.render(item.message.content)"
          :class="!item.message.content && 'blink-block'"
          :key="item.id"
        ></div>
      </div>
    </template>

    <!-- 当前无会话 -->
    <NoSession v-else />
  </div>
</template>

<style scoped lang="scss">
.session {
  .blink-block::after {
    @apply absolute h-6 w-1 bg-[var(--color-text-2)] content-none;
    animation: blink 1s infinite;
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
