<script lang="ts" setup>
import { IconEdit, IconDelete } from '@arco-design/web-vue/es/icon'
import { useRoleStore } from '@/stores'

const { currentRole, roleList } = storeToRefs(useRoleStore())
</script>

<template>
  <div class="app-input flex items-center gap-2 p-2">
    <!-- 角色选择 -->
    <div class="w-10">
      <a-popover title="请选择对话的角色" trigger="click">
        <Avatar :value="currentRole?.name" />

        <template #content>
          <a-list>
            <a-list-item
              v-for="item in roleList"
              :key="item.id"
              @click="currentRole = item"
            >
              <a-list-item-meta
                :title="item.name"
                :description="item.description"
              >
                <template #avatar>
                  <Avatar class="w-10!" :value="item.name" />
                </template>
              </a-list-item-meta>
              <template #actions>
                <IconEdit />
                <IconDelete />
              </template>
            </a-list-item>
          </a-list>
        </template>
      </a-popover>
    </div>

    <a-textarea
      class="bordered bg-transparent!"
      placeholder="有什么问题尽管问我"
      allow-clear
    ></a-textarea>
  </div>
</template>

<style lang="scss" scoped>
.app-input {
  .arco-textarea-wrapper {
    height: 32px;

    transition: all 0.3s;

    border-radius: 32px;
    &.arco-textarea-focus {
      height: 96px;

      border-radius: 0;
    }
  }
}
</style>
