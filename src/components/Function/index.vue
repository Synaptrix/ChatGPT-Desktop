<script setup lang="ts">
import {
  IconPlusCircle,
  IconRefresh,
  IconDelete,
  IconHistory,
  IconSettings,
  IconStop,
  IconImage
} from '@arco-design/web-vue/es/icon'
import { emit } from '@tauri-apps/api/event'
import { estimateTokens, getMemoryList } from '@/utils'

const { currentRole, textAreaValue } = storeToRefs(useRoleStore())

const sessionStore = useSessionStore()
const { switchSession, deleteSession, updateSessionData } = sessionStore
const { isThinking, sessionDataList, chatController } =
  storeToRefs(sessionStore)

const { isMemory } = storeToRefs(useSettingsStore())

const disabled = computed(
  () => isThinking.value || !sessionDataList.value.length
)

const tokenUsage = ref(0)

watch([textAreaValue, isMemory], async () => {
  // 角色描述字符数
  const roleTokens = estimateTokens(currentRole.value!.description)

  // 输入字符数
  const textAreaTokens = estimateTokens(textAreaValue.value)

  // 记忆模式下额外消耗的字符数
  const memoryList = await getMemoryList()

  const memoryTokens = estimateTokens(
    memoryList.map((item) => item.content).join('')
  )

  tokenUsage.value = textAreaTokens + roleTokens + memoryTokens
})

// 控制历史列表抽屉
const drawerVisible = ref(false)
const closeDrawer = () => {
  drawerVisible.value = false
}

// TODO: 在获取数据时删除的处理，在获取数据时切换历史记录的处理
const functions = computed(() => [
  {
    content: '新建对话',
    icon: IconPlusCircle,
    disabled: disabled.value,
    handleClick: () => switchSession()
  },
  {
    content: isThinking.value ? '停止思考' : '重新回答',
    icon: isThinking.value ? IconStop : IconRefresh,
    disabled: !sessionDataList.value.length,
    handleClick: () => {
      if (isThinking.value) {
        chatController.value?.abort()
        if (!sessionDataList.value.at(-1)?.message.content) {
          sessionDataList.value.at(-1)!.message.content = '你停止了思考'
        }
        updateSessionData(sessionDataList.value.at(-1)!)
      } else {
        getAiMessage()
      }
    }
  },
  {
    content: '导出图片',
    icon: IconImage,
    disabled: disabled.value,
    handleClick: () => saveImage('session-list')
  },
  {
    content: '清空对话',
    icon: IconDelete,
    disabled: disabled.value,
    isDelete: true,
    handleClick: () => deleteSession()
  },
  {
    content: '历史记录',
    icon: IconHistory,
    disabled: isThinking.value,
    handleClick: () => (drawerVisible.value = true)
  },
  {
    content: '设置',
    icon: IconSettings,
    handleClick: () => emit('open-settings')
  }
])

const triggerScroll = () => {
  emit('scroll-to-bottom')
}
</script>

<template>
  <div class="function flex select-none items-center justify-between pl-14">
    <!-- 预估将要消耗的token -->
    <div
      class="transition-300 opacity-0"
      :class="textAreaValue.length && 'opacity-100!'"
    >
      {{ isMemory ? '记忆模式：' : '' }}预计消耗
      <span class="mark">{{ tokenUsage }}</span>
      TK
    </div>

    <!-- 当前聊天角色对象 -->
    <div>
      正在与
      <a-tooltip content="点我回到底部">
        <span class="mark cursor-pointer" @click="triggerScroll">
          {{ currentRole?.name }}
        </span>
      </a-tooltip>
      对话
    </div>

    <!-- 功能按钮 -->
    <div class="flex gap-2">
      <a-tooltip
        v-for="(item, index) in functions"
        :content="item.content"
        :key="index"
        :position="index === functions.length - 1 ? 'tr' : 'top'"
      >
        <template v-if="item.isDelete">
          <a-popconfirm
            type="error"
            content="确定要删除该会话吗？"
            @ok="item.handleClick"
          >
            <a-button type="text" :disabled="item.disabled">
              <template #icon>
                <component
                  :is="item.icon"
                  class="text-5.5 text-[var(--color-text-2)]"
                />
              </template>
            </a-button>
          </a-popconfirm>
        </template>
        <a-button
          type="text"
          :disabled="item.disabled"
          @click="item.handleClick"
          v-else
        >
          <template #icon>
            <component
              :is="item.icon"
              class="text-5.5 text-[var(--color-text-2)]"
            />
          </template>
        </a-button>
      </a-tooltip>
    </div>
  </div>

  <!-- 历史会话抽屉 -->
  <HistoryDrawer :visible="drawerVisible" :set-visible="closeDrawer" />
</template>

<style scoped lang="scss">
.function {
  .arco-btn.arco-btn-disabled {
    .arco-icon {
      color: var(--color-text-4);
    }
  }
}
</style>
