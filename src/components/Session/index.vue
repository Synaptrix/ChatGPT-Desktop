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
  <div class="flex-1 cursor-default overflow-auto">
    <template v-if="sessionDataList.length">
      <!-- <h3>当前session{{ currentSession?.id }}{{ currentSession?.title }}</h3> -->
      <div
        class="flex items-start gap-4 p-2"
        v-for="item in sessionDataList"
        :key="item.time"
      >
        <Avatar class="w-12!" :value="item.is_ask ? uuid : currentRole?.name" />
        <div
          v-highlight
          class="flex flex-1 flex-col gap-3.5 py-[11.5px] leading-6"
          v-html="marked(item.message.content)"
        ></div>
      </div>
    </template>

    <!-- 当前无会话 -->
    <NoSession v-else />
  </div>
</template>

<style scoped lang="scss"></style>
