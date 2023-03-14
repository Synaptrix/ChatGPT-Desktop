<script lang="ts" setup>
import { IconEdit, IconCheck, IconDelete } from '@arco-design/web-vue/es/icon'
import { useRoleStore } from '@/stores'
import { DEFAULT_ROLE } from '@/constants'
import type { TablePayload } from '@/types'

const roleStore = useRoleStore()
const { addRole, updateRole, deleteRole } = roleStore
const { currentRole, roleList } = storeToRefs(roleStore)

const isEdit = ref(false)
const editItem = ref<TablePayload>({})

const handleEdit = (data: TablePayload) => {
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
<!-- TODO:输入内容的非空判断 -->
<!-- TODO:修改当前选中的，有 bug -->
<template>
  <a-popover
    title="请选择对话的角色"
    trigger="click"
    class="role-popover w-full"
  >
    <template #title>
      <div class="flex items-center justify-between">
        <span>请选择对话的角色</span>
        <a-button type="outline">添加角色</a-button>
      </div>
    </template>

    <a-tooltip content="对话角色" position="tl">
      <Avatar class="w-12! cursor-pointer" :value="currentRole?.name" />
    </a-tooltip>

    <template #content>
      <ul class="role-list">
        <li
          class="bordered-top flex cursor-pointer items-center gap-4 p-4 text-[var(--color-text-1)]"
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
                allow-clear
                v-if="isEdit && editItem.id === item.id"
                @click="(e: any) => e.stopPropagation()"
              />
              <span v-else>
                {{ item.name }}
              </span>

              <a-textarea
                v-model="editItem.description"
                allow-clear
                v-if="isEdit && editItem.id === item.id"
                @click="(e: any) => e.stopPropagation()"
              ></a-textarea>
              <span v-else>
                {{ item.description }}
              </span>
            </div>
          </div>

          <div
            class="text-5 flex gap-2"
            v-if="
              item.name !== DEFAULT_ROLE.name ||
              item.description !== DEFAULT_ROLE.description
            "
            @click="(e) => e.stopPropagation()"
          >
            <IconCheck
              @click="handleUpdate"
              v-if="isEdit && editItem.id === item.id"
            />

            <IconEdit @click="handleEdit(item)" v-else />

            <!-- TODO:编辑的时候变成 x -->
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
    @apply flex max-h-[calc(100vh-56px)] flex-col rounded-t-xl px-0 py-4;

    .arco-popover-title {
      @apply p-4 pt-0;
    }

    .arco-popover-content {
      @apply flex-1 overflow-auto;
    }
  }
}
</style>
