<script setup lang="ts">
import { useSessionStore } from '@/stores'
import {
  IconDelete,
  IconEdit,
  IconCheck,
  IconClose
} from '@arco-design/web-vue/es/icon'
import type { SessionPayload } from '@/types'
import { Message } from '@arco-design/web-vue'

const props = defineProps<{ visible: boolean; setVisible: () => void }>()

const sessionStore = useSessionStore()
const { sessionList, currentSession } = storeToRefs(sessionStore)
const { switchSession, getSessionList, deleteSession, updateSession } =
  sessionStore

const search = ref('')
const searchRef = ref<HTMLInputElement>()

const filterList = computed(() =>
  sessionList.value.filter((item) => item.title.includes(search.value))
)

const renderList = computed(() =>
  search.value ? filterList.value : sessionList.value
)

const isEdit = computed(() => sessionList.value.some((item) => item.isEdit))

const handleClick = (item: SessionPayload) => {
  if (isEdit.value) return Message.info('请先完成当前编辑')

  switchSession(item)

  search.value = ''
  props.setVisible()
}

const handleOpen = () => {
  if (!currentSession.value) return

  searchRef.value?.focus()

  // 列表滚动到当前的会话
  const el = document.getElementById(currentSession.value.id)
  if (!el) return

  el.scrollIntoView()
}

const handleClose = () => {
  if (isEdit.value) return Message.info('请先完成当前编辑')

  search.value = ''
  props.setVisible()
}

const handleEdit = (item: SessionPayload) => {
  if (isEdit.value) return Message.info(`请先完成当前编辑`)

  item.isEdit = true
}

const handleUpdate = (item: SessionPayload) => {
  handleCancle(item)

  updateSession(item)
}

const handleCancle = (item: SessionPayload) => {
  if (!item.title.trim()) return Message.info(`标题不能为空`)

  item.isEdit = false
}
</script>

<template>
  <a-drawer
    :visible="visible"
    placement="left"
    :width="300"
    class="history-drawer"
    @cancel="handleClose"
    @before-open="getSessionList"
    @open="handleOpen"
    unmountOnClose
  >
    <!-- 加入全部清除的按钮 -->
    <template #title> 会话历史 </template>
    <ul class="flex flex-col gap-2 scroll-smooth" v-if="renderList.length">
      <li
        v-for="item in renderList"
        class="transition-300 group flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-[var(--color-fill-2)]"
        :class="{
          'bg-[rgb(var(--blue-6))]! text-white': item.id === currentSession?.id
        }"
        :key="item.id"
        :id="item.id"
      >
        <!-- TODO: 优化此处宽度的计算，这样写有点鸡肋 -->
        <div class="flex w-[calc(100%-16px)] items-center gap-2">
          <Avatar :value="item.name" class="w-10!" />
          <div
            class="flex w-[calc(100%-56px)] flex-col gap-3 leading-none"
            @click="handleClick(item)"
          >
            <a-input
              v-model="item.title"
              class="w-[150px] rounded-sm"
              size="mini"
              @click.stop
              allow-clear
              v-if="item.isEdit"
            />

            <div class="truncate" v-else>
              {{ item.title }}
            </div>

            <span> 与 {{ item.name }} 的聊天 </span>
          </div>
        </div>
        <div
          v-if="!item.isEdit"
          class="text-5 flex gap-2 opacity-0 group-hover:opacity-100"
        >
          <IconEdit @click="handleEdit(item)" />
          <IconDelete
            @click="deleteSession(item)"
            :class="{
              'pointer-events-none opacity-50': item.id === currentSession?.id
            }"
          />
        </div>
        <div v-else class="text-5 flex gap-2 opacity-0 group-hover:opacity-100">
          <IconCheck @click="handleUpdate(item)" />
          <IconClose @click="handleCancle(item)" />
        </div>
      </li>
    </ul>

    <a-empty v-else class="mt-1/2" />

    <template #footer>
      <a-input-search
        ref="searchRef"
        v-model="search"
        placeholder="搜索对话"
        allow-clear
        class="rounded-md"
      />
    </template>
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
