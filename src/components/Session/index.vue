<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import MarkdownItHighlight from 'markdown-it-highlightjs'
import CopyCode from '@/utils/copyCode'
import { IconImage } from '@arco-design/web-vue/es/icon'
import { saveImage } from '@/utils'
import { useSettingsStore, useSessionStore, useRoleStore } from '@/stores'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const marked = new MarkdownIt().use(MarkdownItHighlight).use(CopyCode)

const { uuid } = storeToRefs(useSettingsStore())
const { sessionDataList } = storeToRefs(useSessionStore())
const { currentRole } = storeToRefs(useRoleStore())

const sessionElement = ref<HTMLDivElement | null>(null)

const localTime = (time: string) =>
  dayjs.utc(time).local().format('YYYY-MM-DD HH:mm:ss')

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
  <div
    ref="sessionElement"
    class="session relative flex-1 cursor-default overflow-auto"
  >
    <template v-if="sessionDataList.length">
      <div
        v-for="item in sessionDataList"
        :id="`session-data-${item.id}`"
        class="flex gap-4 px-2 py-4"
        :class="item.is_ask && 'flex-row-reverse'"
        :key="item.id"
      >
        <Avatar class="w-12!" :value="item.is_ask ? uuid : currentRole?.name" />

        <div
          class="relative flex w-[calc(100%-8rem)] flex-col gap-2"
          :class="item.is_ask && 'items-end'"
        >
          <span class="text-true-gray text-xs">{{
            localTime(item.time!)
          }}</span>

          <div class="blink-block" v-if="!item.message.content"></div>
          <div
            class="session-item relative flex w-fit flex-col gap-4 rounded-md p-4"
            :class="
              item.is_ask
                ? 'bg-[rgb(var(--blue-6))] text-white'
                : 'bg-[var(--background-color)]'
            "
            v-html="marked.render(item.message.content)"
            v-else
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
    --uno: absolute h-6 w-1 bg-[var(--color-text-2)] content-none;
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
