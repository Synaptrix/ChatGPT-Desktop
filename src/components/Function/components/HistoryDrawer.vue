<script setup lang="ts">
import type { SessionPayload } from '@/types'

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
  const element = document.getElementById(currentSession.value.id)
  if (!element) return

  // TODO: 元素在视口内不滑动
  element.scrollIntoView({
    behavior: 'smooth'
  })
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
  if (!item.title.trim()) return Message.info('标题不能为空')

  item.isEdit = false

  updateSession(item)
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
    <!-- TODO:加入全部清除的按钮 -->
    <template #title> 会话历史 </template>

    <ul class="flex flex-col gap-2" v-if="renderList.length">
      <li
        v-for="item in renderList"
        class="transition-300 group flex cursor-pointer items-center gap-2 rounded-lg p-2 leading-none hover:bg-[var(--color-fill-2)]"
        :class="{
          'bg-[rgb(var(--blue-6))]!': currentSession?.id === item.id,
          'bg-transparent!': item.isEdit,
          'text-white': currentSession?.id === item.id && !item.isEdit
        }"
        :id="item.id"
        :key="item.id"
        @click="handleClick(item)"
      >
        <Avatar :value="item.name" class="w-10!" />

        <div class="flex w-[calc(100%-3rem)] items-center justify-between">
          <div class="flex w-[calc(100%-46px)] flex-col gap-3">
            <a-input
              v-model="item.title"
              class="w-[150px] rounded-sm"
              size="small"
              allow-clear
              v-if="item.isEdit"
              @click.stop
            />

            <div class="truncate" v-else>
              {{ item.title }}
            </div>

            <div class="truncate">与 {{ item.name }} 的会话</div>
          </div>

          <div
            class="text-5 flex gap-2 opacity-0 group-hover:opacity-100"
            @click.stop
          >
            <template v-if="!item.isEdit">
              <icon-edit @click="handleEdit(item)" />
              <a-popconfirm
                type="error"
                content="确定删除该会话吗？"
                @ok="deleteSession(item)"
              >
                <icon-delete />
              </a-popconfirm>
            </template>
            <template v-else>
              <icon-check @click="handleUpdate(item)" />
              <icon-close @click="getSessionList" />
            </template>
          </div>
        </div>
      </li>
    </ul>

    <div class="flex h-full items-center" v-else>
      <a-empty description="暂无历史会话" />
    </div>

    <template #footer>
      <a-input-search
        ref="searchRef"
        v-model="search"
        placeholder="搜索对话"
        allow-clear
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
