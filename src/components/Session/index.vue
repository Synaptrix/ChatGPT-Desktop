<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'
import MarkdownIt from 'markdown-it'
import MarkdownItHighlight from 'markdown-it-highlightjs'
import type { SessionData } from '@/types'
import { estimateTokens } from '@/utils'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const marked = new MarkdownIt({
  linkify: true
})
  .use(MarkdownItHighlight)
  .use(copyCode)

const { uuid } = storeToRefs(useSettingsStore())
const { sessionDataList, currentSession } = storeToRefs(useSessionStore())
const { currentRole } = storeToRefs(useRoleStore())

const getLocalTime = (time: string) =>
  dayjs.utc(time).local().format('YYYY-MM-DD HH:mm:ss')

const sessionElement = ref<HTMLDivElement | null>(null)
const isAutoScroll = ref(true)

/**
 * 自动滚动到底部
 * @param isAuto
 */
const autoScroll = (isSmooth = false) => {
  if (!sessionElement.value || !isAutoScroll.value) return

  sessionElement.value.scroll({
    top: sessionElement.value.scrollHeight,
    behavior: isSmooth ? 'smooth' : 'auto'
  })
}

/**
 * 滚轮事件
 * @param event 滚轮事件参数
 */
const handleWheel = (event: WheelEvent) => {
  if (event.deltaY > 0) return

  isAutoScroll.value = false
}

/**
 * 滚动事件
 */
const handleScroll = () => {
  if (!sessionElement.value) return

  const { scrollTop, clientHeight, scrollHeight } = sessionElement.value

  if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
    isAutoScroll.value = true
  }
}

/**
 * 计算单条消息消耗的token
 * @param item 单条消息
 */
// FIXME 这里的item/data类型报错搞不定，只能用any
const calcToken = (item: any) => {
  // 角色描述字符数
  const roleToken = estimateTokens(currentRole.value!.description)
  // 消息内容字符数
  const contentToken = estimateTokens(item.message.content)
  // 记忆模式下额外消耗的字符数
  let memoryToken = 0
  if (item.is_memory) {
    // 获取sessionDataList中的此条之前的最后5条消息
    const memoryList = sessionDataList.value
      .filter((data: any) => data.id < item.id)
      .slice(-5)
    memoryToken = estimateTokens(
      memoryList.map((data) => data.message.content).join('')
    )
  }

  if (item.is_ask) {
    return `${roleToken + contentToken + memoryToken}TK${
      item.is_memory ? '*' : ''
    }`
  }

  return `${contentToken}TK`
}

onMounted(() => {
  listen('scroll-to-bottom', () => {
    isAutoScroll.value = true

    autoScroll(true)
  })
})

onUpdated(autoScroll)

watch([currentSession, sessionDataList], () => {
  isAutoScroll.value = true
})
</script>

<template>
  <!-- TODO: 拆分优化组件 -->
  <div
    ref="sessionElement"
    id="session-list"
    class="relative flex-1 cursor-default overflow-auto"
    @scroll="handleScroll"
    @wheel="handleWheel"
  >
    <template v-if="sessionDataList.length">
      <div
        v-for="item in sessionDataList"
        :id="`session-data-${item.id}`"
        class="flex gap-4 px-2 py-4"
        :class="item.is_ask && 'flex-row-reverse'"
        :key="item.id"
      >
        <div class="flex flex-col items-center gap-1">
          <Avatar
            class="w-12!"
            :value="item.is_ask ? uuid : currentRole?.name"
          />
          <span class="text-gray text-xs">{{ calcToken(item) }}</span>
        </div>
        <div
          class="relative flex w-[calc(100%-8rem)] flex-col gap-2"
          :class="item.is_ask && 'items-end'"
        >
          <span class="text-xs text-[var(--color-text-2)]">
            {{ getLocalTime(item.time!) }}
          </span>

          <div class="blink-block" v-if="!item.message.content"></div>

          <div class="session-item group relative max-w-fit" v-else>
            <div
              class="operation transition-300 absolute flex flex-col gap-1 opacity-0 group-hover:opacity-100"
              :class="
                item.is_ask
                  ? 'left-0 -translate-x-full pr-2'
                  : 'right-0 translate-x-full pl-2'
              "
            >
              <a-tooltip
                content="复制"
                :position="item.is_ask ? 'right' : 'left'"
              >
                <div
                  class="copy"
                  :id="`copy-${item.id}`"
                  @click="
                    copyText($event, { nodeId: `session-content-${item.id}` })
                  "
                ></div>
              </a-tooltip>

              <a-tooltip
                content="导出 Markdown 文件"
                :position="item.is_ask ? 'right' : 'left'"
              >
                <div
                  class="markdown"
                  :id="`markdown-${item.id}`"
                  @click="saveMarkdown($event, item.message.content)"
                ></div>
              </a-tooltip>

              <a-tooltip
                content="导出图片"
                :position="item.is_ask ? 'right' : 'left'"
              >
                <icon-image @click="saveImage(`session-data-${item.id}`)" />
              </a-tooltip>
            </div>

            <div
              :id="`session-content-${item.id}`"
              class="session-content flex flex-col gap-4 rounded-md p-4"
              v-html="marked.render(item.message.content)"
              :class="[
                item.is_ask
                  ? 'bg-[rgb(var(--primary-6))] text-white'
                  : 'bg-[var(--session-background)]',
                item.is_ask ? 'session-content--ask' : 'session-content--answer'
              ]"
            ></div>
          </div>
        </div>
      </div>
    </template>

    <!-- 当前无会话 -->
    <NoSession v-else />

    <a-back-top
      @click="isAutoScroll = false"
      target-container="#session-list"
      class="bottom-[114px]"
      :visible-height="100"
    >
      <a-button type="primary" shape="circle">
        <template #icon>
          <icon-caret-up />
        </template>
      </a-button>
    </a-back-top>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
