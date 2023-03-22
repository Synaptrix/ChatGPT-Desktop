<script setup lang="ts">
import { useSessionStore } from '@/stores'
import { IconDelete } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import type { SessionPayload } from '@/types'

const props = defineProps<{ visible: boolean; setVisible: () => void }>()

const sessionStore = useSessionStore()
const { sessionList, currentSession, isThinking } = storeToRefs(sessionStore)
const { switchSession, getSessionList, deleteSession } = sessionStore

const handleClick = (item: SessionPayload) => {
  switchSession(item)

  props.setVisible()
}
</script>

<template>
  <a-drawer
    :visible="visible"
    placement="left"
    :footer="false"
    :width="300"
    class="history-drawer"
    @cancel="setVisible"
    @before-open="getSessionList"
    unmountOnClose
  >
    <!-- 加入全部清除的按钮 -->
    <template #title> 会话历史 </template>
    <ul class="flex flex-col gap-2">
      <li
        v-for="item in sessionList"
        class="transition-300 group flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-[var(--color-fill-2)]"
        :class="{
          'bg-[rgb(var(--blue-6))]! text-white': item.id === currentSession?.id
        }"
        :key="item.id"
      >
        <!-- TODO: 优化此处宽度的计算，这样写有点鸡肋 -->
        <div class="flex w-[calc(100%-16px)] items-center gap-2">
          <Avatar :value="item.name" class="w-10!" />
          <div
            class="flex w-[calc(100%-56px)] flex-col gap-3 leading-none"
            @click="handleClick(item)"
          >
            <div class="truncate">
              {{ item.title }}
            </div>

            <span> 与 {{ item.name }} 的聊天 </span>
          </div>
        </div>
        <IconDelete
          class="text-5 opacity-0 group-hover:opacity-100"
          @click="deleteSession(item)"
        />
      </li>
    </ul>
  </a-drawer>
</template>

<style lang="scss">
.history-drawer {
  --uno: overflow-hidden rounded-xl;
  .arco-drawer {
    .arco-drawer-body {
      --uno: p-2;
    }
  }
}
</style>
