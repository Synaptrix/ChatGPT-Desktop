<script lang="ts" setup>
import { IconEdit, IconDelete, IconCheck } from '@arco-design/web-vue/es/icon'
import { useRoleStore } from '@/stores'
import type { TablePayload } from '@/types'

const defaultRoleName = import.meta.env.VITE_DEFAULT_ROLE_NAME
const defaultRoleDescription = import.meta.env.VITE_DEFAULT_ROLE_DESCRIPTION

const roleStore = useRoleStore()
const { addRole, updateRole, deleteRole } = roleStore
const { currentRole, roleList } = storeToRefs(roleStore)

const isEdit = ref(false)
const editItem = ref<TablePayload>({})

const handleEdit = (data: TablePayload) => {
  // 修改完后没有确认修改而是直接修改另外一个
  handleUpdate()

  isEdit.value = true
  editItem.value = data
}

const handleUpdate = () => {
  if (!editItem.value.id) return

  isEdit.value = false
  updateRole(editItem.value)
}

watch(currentRole, handleUpdate)
</script>
<!-- TODO:优化代码和 css 样式 -->
<template>
  <a-popover
    title="请选择对话的角色"
    trigger="click"
    class="role-popover w-full"
  >
    <!-- 弹框标题 -->
    <template #title>
      <div class="flex items-center justify-between">
        <span>请选择对话的角色</span>
        <a-button type="outline">添加角色</a-button>
      </div>
    </template>
    <!-- 触发器为头像 -->
    <Avatar class="w-10! cursor-pointer" :value="currentRole?.name" />
    <!-- 弹框内容 -->
    <template #content>
      <ul class="role-list">
        <li
          class="bordered-bottom flex cursor-pointer items-center gap-4 p-4 text-[var(--color-text-1)]"
          :style="{
            background:
              currentRole?.id === item.id
                ? 'rgb(var(--blue-6), 0.2)'
                : 'transparent'
          }"
          v-for="item in roleList"
          :key="item.id"
          @click="currentRole = item"
        >
          <div class="flex flex-1 items-center gap-4">
            <Avatar class="w-10!" :value="item.name" />

            <div class="flex flex-1 flex-col gap-2">
              <a-input
                v-model="editItem.name"
                v-if="isEdit && editItem.id === item.id"
                @click="(e: any) => e.stopPropagation()"
              />
              <span v-else>
                {{ item.name }}
              </span>

              <a-textarea
                v-model="editItem.description"
                v-if="isEdit && editItem.id === item.id"
                @click="(e: any) => e.stopPropagation()"
              ></a-textarea>
              <span v-else>
                {{ item.description }}
              </span>
            </div>
          </div>

          <div
            class="text-4 flex gap-2"
            v-if="
              item.name !== defaultRoleName ||
              item.description !== defaultRoleDescription
            "
            @click="(e) => e.stopPropagation()"
          >
            <IconCheck
              @click="handleUpdate"
              v-if="isEdit && editItem.id === item.id"
            />

            <IconEdit @click="handleEdit(item)" v-else />

            <IconDelete @click="deleteRole(item.id!)" />
          </div>
        </li>
      </ul>
    </template>
  </a-popover>
</template>

<style lang="scss">
.role-popover {
  .arco-trigger-content {
    @apply flex max-h-[calc(100vh-54px)] flex-col px-0 py-4;

    .arco-popover-title {
      @apply p-b-4;
    }

    .arco-popover-content {
      @apply mt-0 flex-1 overflow-auto;
    }
  }
  .role-list {
    li:last-child {
      border-bottom: 0;
    }
  }
}
</style>
