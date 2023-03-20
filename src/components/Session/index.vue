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
  <div
    ref="sessionElement"
    class="session relative flex-1 cursor-default overflow-auto"
  >
    <template v-if="sessionDataList.length">
      <div
        class="flex items-start gap-4 py-2 px-4"
        v-for="item in sessionDataList"
        :key="item.time"
        :id="`session-data-${item.id}`"
        :class="item.is_ask && 'flex-row-reverse'"
      >
        <!-- TODO: 优化 css -->
        <Avatar
          class="w-12! flex-shrink-0 flex-grow-0"
          :value="item.is_ask ? uuid : currentRole?.name"
        />
        <div
          class="group relative flex w-auto flex-col py-3"
          :key="item.id"
          :class="
            item.is_ask
              ? 'bg-red items-end rounded-md pr-3 pl-8'
              : 'bg-blue rounded-md pl-3 pr-8'
          "
        >
          <div
            class="text-5 absolute top-2 opacity-0 transition group-hover:opacity-100"
            :class="item.is_ask ? 'left-2' : 'right-2'"
          >
            <IconImage
              class="cursor-pointer"
              @click="saveImage(`session-data-${item.id}`)"
            />
          </div>
          <div
            class="`session-item leading-6` flex flex-col gap-4"
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

  ::v-deep(pre) {
    margin: 0;
    code {
      @apply rounded-md;
    }
    + .markdown-it-code-copy {
      width: 20px;
      height: 20px;

      border: 0;
      outline: 0;
      background: url('@/assets/image/copy.svg') no-repeat center;
      background-size: contain;
    }
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
