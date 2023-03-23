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

const { currentRole } = storeToRefs(useRoleStore())

const sessionStore = useSessionStore()
const { switchSession, deleteSession, updateSessionData } = sessionStore
const { isThinking, sessionDataList, chatController } =
  storeToRefs(sessionStore)

const disabled = computed(
  () => isThinking.value || !sessionDataList.value.length
)

// 控制设置弹框
const modalVisible = ref(false)
const closeModal = () => {
  modalVisible.value = false
}

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
    handleClick: () => (modalVisible.value = true)
  }
])

const triggerScroll = () => {
  emit('scroll-to-bottom')
}
</script>

<!-- TODO:把聊天对象移过来 -->
<template>
  <div class="function text-6 relative flex justify-end">
    <!-- 当前聊天角色对象 -->
    <div class="top-50% left-50% text-4 -translate-1/2 absolute">
      正在与
      <a-tooltip content="点我回到底部">
        <span class="mark cursor-pointer" @click="triggerScroll">
          {{ currentRole?.name }}
        </span>
      </a-tooltip>
      对话
    </div>

    <div class="flex gap-2">
      <a-tooltip
        v-for="(item, index) in functions"
        :content="item.content"
        :key="index"
        :position="index === functions.length - 1 ? 'tr' : 'top'"
      >
        <a-button
          type="text"
          :disabled="item.disabled"
          @click="item.handleClick"
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

  <!-- 设置弹框 -->
  <SettingsModal :visible="modalVisible" :set-visible="closeModal" />

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
