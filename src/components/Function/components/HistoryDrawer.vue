<script lang="ts" setup>
import { useSessionStore } from '@/stores'
import { IconDelete } from '@arco-design/web-vue/es/icon'

defineProps<{ visible: boolean; setVisible: () => void }>()

const sessionStore = useSessionStore()
const { sessionList, currentSession } = storeToRefs(sessionStore)
const { switchSession, getSessionList, deleteSession } = sessionStore
</script>

<template>
  <a-drawer
    :visible="visible"
    placement="left"
    :footer="false"
    :closable="false"
    @cancel="setVisible"
    @before-open="getSessionList"
    unmountOnClose
  >
    <template #title> 会话历史 </template>
    <div class="flex flex-col gap-3">
      <a-card
        hoverable
        v-for="item in sessionList"
        :body-style="{
          padding: '5px'
        }"
        :key="item.id"
        :class="{ 'bg-red-200': item.id === currentSession?.id }"
        class="relative"
      >
        <div class="flex items-center justify-between gap-4">
          <Avatar :value="item.name" class="!w-10" />
          <div class="flex flex-1 flex-col justify-between">
            <span>{{ item.title }}</span>
            <span
              >与{{ item.name }}
              <a-link @click="switchSession(item)" class="text-sm"
                >继续对话</a-link
              >
            </span>
          </div>
        </div>

        <IconDelete
          @click="deleteSession(item)"
          class="hover:bg-red-4 absolute top-1 right-1 hover:cursor-pointer"
        />
      </a-card>
    </div>
  </a-drawer>
</template>

<style lang="scss" scoped></style>
