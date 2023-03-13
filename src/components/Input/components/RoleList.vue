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
  if (editItem.value.id) handleUpdate()

  isEdit.value = true
  editItem.value = data
}

const handleUpdate = () => {
  isEdit.value = false
  updateRole(editItem.value!)
}
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
      <a-list>
        <a-list-item
          v-for="item in roleList"
          :key="item.id"
          @click="currentRole = item"
        >
          <a-list-item-meta>
            <!-- 列表标题 -->
            <template #title>
              <a-input
                v-model="editItem.name"
                v-if="isEdit && editItem.id === item.id"
              />
              <template v-else>
                {{ item.name }}
              </template>
            </template>
            <!-- 列表头像 -->
            <template #avatar>
              <Avatar class="w-10!" :value="item.name" />
            </template>
            <!-- 列表描述 -->
            <template #description>
              <a-textarea
                v-model="editItem.description"
                v-if="isEdit && editItem.id === item.id"
              ></a-textarea>
              <template v-else>
                {{ item.description }}
              </template>
            </template>
          </a-list-item-meta>

          <!-- 列表操作 默认角色不支持修改和删除 -->
          <template
            #actions
            v-if="
              item.name !== defaultRoleName ||
              item.description !== defaultRoleDescription
            "
          >
            <div class="text-4 flex gap-2" @click="(e) => e.stopPropagation()">
              <IconCheck
                @click="handleUpdate"
                v-if="isEdit && editItem.id === item.id"
              />

              <IconEdit @click="handleEdit(item)" v-else />

              <IconDelete @click="deleteRole(item.id!)" />
            </div>
          </template>
        </a-list-item>
      </a-list>
    </template>
  </a-popover>
</template>

<style lang="scss">
.role-popover {
  .arco-trigger-content {
    @apply flex max-h-[calc(100vh-54px)] flex-col p-3;

    .arco-popover-title {
      @apply p-b-3;
    }

    .arco-popover-content {
      @apply mt-0 flex-1 overflow-auto;
    }
  }
}
</style>
