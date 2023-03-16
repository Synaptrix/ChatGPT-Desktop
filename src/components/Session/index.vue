<script setup lang="ts">
import { useSettingsStore, useSessionStore, useRoleStore } from '@/stores'

const { uuid } = storeToRefs(useSettingsStore())
const { currentSession, sessionDataList } = storeToRefs(useSessionStore())
const { currentRole } = storeToRefs(useRoleStore())
</script>

<template>
  <div class="flex-1 cursor-default overflow-auto">
    <template v-if="sessionDataList.length">
      <h3>当前session{{ currentSession?.id }}{{ currentSession?.title }}</h3>
      <div
        class="flex items-start p-2"
        v-for="(item, index) in sessionDataList"
        :key="item.time"
      >
        <Avatar class="w-14!" :value="index % 2 ? uuid : currentRole?.name" />
        <div>
          {{ item.messages }}
        </div>
      </div>
    </template>

    <!-- 当前无会话 -->
    <NoSession v-else />
  </div>
</template>

<style scoped lang="scss"></style>
