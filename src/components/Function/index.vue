<script setup lang="ts">
import {
  IconPlusCircle,
  IconRefresh,
  IconDelete,
  IconHistory,
  IconSettings
} from '@arco-design/web-vue/es/icon'
import { useRoleStore, useSessionStore } from '@/stores'
import { getAiMessage } from '@/api'

const { currentRole } = storeToRefs(useRoleStore())

const sessionStore = useSessionStore()
const { switchSession, deleteSession } = sessionStore
const { isThinking, sessionDataList } = storeToRefs(sessionStore)

const disabled = computed(
  () => isThinking.value || !sessionDataList.value.length
)

// 控制设置弹框
const modalVisible = ref(false)
const setModalVisible = () => {
  modalVisible.value = !modalVisible.value
}

// 控制历史列表抽屉
const drawerVisible = ref(false)
const setDrawerVisible = () => {
  drawerVisible.value = !drawerVisible.value
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
    content: '重新回答',
    icon: IconRefresh,
    disabled: disabled.value,
    handleClick: () => getAiMessage()
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
    handleClick: setDrawerVisible
  },
  {
    content: '设置',
    icon: IconSettings,
    handleClick: setModalVisible
  }
])
</script>

<!-- TODO:把聊天对象移过来 -->
<template>
  <div class="function text-6 relative flex justify-end">
    <!-- 当前聊天角色对象 -->
    <div class="top-50% left-50% text-4 -translate-1/2 absolute">
      正在与 <span class="mark">{{ currentRole?.name }}</span> 对话
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
  <SettingsModal :visible="modalVisible" :set-visible="setModalVisible" />

  <!-- 历史会话抽屉 -->
  <HistoryDrawer :visible="drawerVisible" :set-visible="setDrawerVisible" />
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
