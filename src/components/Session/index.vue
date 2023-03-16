<script setup lang="ts">
import { useSettingsStore, useSessionStore, useRoleStore } from '@/stores'

const { uuid } = storeToRefs(useSettingsStore())
const { currentSession, sessionDataList, streamReply } = storeToRefs(
  useSessionStore()
)
const { currentRole } = storeToRefs(useRoleStore())
</script>

<template>
  <!-- TODO: 复制，一键发送，导出图片-->
  <div class="flex-1 cursor-default overflow-auto">
    <template v-if="sessionDataList.length">
      <h3>当前session{{ currentSession?.id }}{{ currentSession?.title }}</h3>
      <div
        class="flex items-start p-2"
        v-for="item in sessionDataList"
        :key="item.time"
      >
        <Avatar class="w-14!" :value="item.is_ask ? uuid : currentRole?.name" />
        <div>
          {{ item.message }}
        </div>
      </div>
      <div>
        <p>正在回答</p>
        <p>{{ streamReply }}</p>
      </div>
    </template>

    <!-- 当前无会话 -->
    <NoSession v-else />
  </div>
</template>

<style scoped lang="scss"></style>
