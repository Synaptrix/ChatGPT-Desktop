<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'

const { sessionDataList, currentSession } = storeToRefs(useSessionStore())
const { showTime } = storeToRefs(useSettingsStore())

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

// 滚轮事件
const handleWheel = (event: WheelEvent) => {
  if (event.deltaY > 0) return

  isAutoScroll.value = false
}

// 滚动事件
const handleScroll = () => {
  if (!sessionElement.value) return

  const { scrollTop, clientHeight, scrollHeight } = sessionElement.value

  if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
    isAutoScroll.value = true
  }
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
        <SessionAvatar :data="item" />

        <div
          class="relative flex w-[calc(100%-8rem)] flex-col gap-2"
          :class="item.is_ask && 'items-end'"
        >
          <span class="text-xs text-[var(--color-text-2)]" v-if="showTime">
            {{ getLocalTime(item.time!) }}
          </span>

          <div class="blink-block" v-if="!item.message.content" />

          <SessionContent :data="item" v-else />
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

<style lang="scss" scoped>
#session-list {
  .blink-block::after {
    animation: blink 1s infinite;

    --uno: absolute h-6 w-1 bg-[var(--color-text-3)] content-none;
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
