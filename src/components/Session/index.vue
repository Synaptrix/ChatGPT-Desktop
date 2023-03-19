<script setup lang="ts">
import { marked } from 'marked'
import { useSettingsStore, useSessionStore, useRoleStore } from '@/stores'

marked.setOptions({
  renderer: new marked.Renderer(), // 这是必填项
  gfm: true, // 启动类似于Github样式的Markdown语法
  pedantic: false, // 只解析符合Markdwon定义的，不修正Markdown的错误
  sanitize: false // 原始输出，忽略HTML标签（关闭后，可直接渲染HTML标签）
})

const { uuid } = storeToRefs(useSettingsStore())
const { currentSession, sessionDataList } = storeToRefs(useSessionStore())
const { currentRole } = storeToRefs(useRoleStore())
</script>

<template>
  <!-- TODO: 复制，一键发送，导出图片-->
  <div class="session flex-1 cursor-default overflow-auto">
    <template v-if="sessionDataList.length">
      <div
        class="flex items-start gap-4 p-2"
        v-for="item in sessionDataList"
        :key="item.time"
      >
        <Avatar class="w-12!" :value="item.is_ask ? uuid : currentRole?.name" />
        <div
          v-highlight
          class="relative flex flex-1 flex-col gap-3.5 py-[11.5px] leading-6"
          v-html="marked(item.message.content)"
          :class="!item.message.content && 'blink-block'"
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
