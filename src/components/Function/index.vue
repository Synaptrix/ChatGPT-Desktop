<script setup lang="ts">
import { emit } from '@tauri-apps/api/event'

const { currentRole } = storeToRefs(useRoleStore())

const { isThinking } = storeToRefs(useSessionStore())

// 控制历史列表抽屉
const drawerVisible = ref(false)
const closeDrawer = () => {
  drawerVisible.value = false
}

const triggerScroll = () => {
  emit('scroll-to-bottom')
}
</script>

<template>
  <div class="function flex select-none items-center justify-between pl-14">
    <!-- 预估将要消耗的token -->
    <TokenUsage />

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
      <!-- 新增对话 -->
      <AddSession />
      <!-- 重新回答 or 停止回答 -->
      <ToggleAnswer />
      <!-- 导出 -->
      <Export />
      <!-- 历史记录 -->
      <a-tooltip content="历史记录">
        <a-button
          type="text"
          :disabled="isThinking"
          @click="drawerVisible = true"
        >
          <template #icon>
            <icon-history />
          </template>
        </a-button>
      </a-tooltip>
      <!-- 设置 -->
      <a-tooltip content="设置" position="tr">
        <a-button type="text" @click="emit('open-settings')">
          <template #icon>
            <icon-settings />
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
  ::v-deep(.arco-btn) {
    .arco-icon {
      --uno: text-5.5 text-[var(--color-text-2)];
    }
    &.arco-btn-disabled {
      .arco-icon {
        color: var(--color-text-4);
      }
    }
  }
}
</style>
