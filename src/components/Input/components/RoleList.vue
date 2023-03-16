<script lang="ts" setup>
import {
  IconEdit,
  IconCheck,
  IconDelete,
  IconClose
} from '@arco-design/web-vue/es/icon'
import { useRoleStore, useSessionStore } from '@/stores'
import type { RolePayload } from '@/types'

const roleStore = useRoleStore()
const { updateRole, deleteRole, addRole, getRoleList } = roleStore
const { currentRole, showList, isShow, isAddNew } = storeToRefs(roleStore)

const { sessionDataList } = storeToRefs(useSessionStore())

const handleUpdate = (item: RolePayload) => {
  if (isAddNew.value) {
    const { name, description } = item
    addRole({ name, description })
  } else {
    if (!item.id) return
    item.isEdit = false
    updateRole(item)
  }
}

const handleSelect = (role: RolePayload) => {
  isShow.value = false
  currentRole.value = role
}

const handleAdd = () => {
  isAddNew.value = true
  // TODO 这里需要优化，自动聚焦到输入框
}

const handleHide = () => {
  // 判断是否有正在编辑的角色
  const isEdit = showList.value.some((item) => item.isEdit)
  if (isEdit) return
  isShow.value = false
}
</script>
<!-- TODO:优化代码和 css 样式 -->
<!-- TODO:输入内容的非空判断 -->
<!-- TODO:修改当前选中的，有 bug -->
<template>
  <a-popover
    title="请选择对话的角色"
    :popup-visible="sessionDataList.length ? false : isShow"
    class="role-popover w-full"
    @click="isShow = true"
    @popup-visible-change="handleHide"
  >
    <template #title>
      <div class="flex items-center justify-between">
        <span>{{ isAddNew ? '请填写信息' : '请选择对话的角色' }}</span>
        <a-button type="outline" @click="handleAdd" v-if="!isAddNew"
          >添加角色</a-button
        >
      </div>
    </template>

    <a-tooltip content="对话角色" position="tl">
      <Avatar class="w-12! cursor-pointer" :value="currentRole?.name" />
    </a-tooltip>

    <template #content>
      <ul class="role-list">
        <li
          class="flex cursor-pointer items-center gap-4 rounded-t bg-transparent p-4 text-[var(--color-text-1)] hover:bg-red-100"
          :class="{
            'bg-blue-200!': currentRole?.id === item.id
          }"
          v-for="item in showList"
          :key="item.id"
          @click="item.isEdit ? '' : handleSelect(item)"
        >
          <div class="flex flex-1 items-center gap-4">
            <Avatar class="w-10!" :value="item.name" />

            <div class="flex flex-1 flex-col gap-2">
              <a-input
                v-model="item.name"
                placeholder="请输入角色名称"
                allow-clear
                v-if="item.isEdit"
                @click.stop
              />
              <span v-else>
                {{ item.name }}
              </span>

              <a-textarea
                v-model="item.description"
                placeholder="请输入角色描述"
                auto-size
                allow-clear
                v-if="item.isEdit"
                @click.stop
              ></a-textarea>
              <span v-else>
                {{ item.description }}
              </span>
            </div>
          </div>

          <!-- TODO 这里我在在表里新增一个字is_default，更方便处理 -->
          <div v-if="!item.is_default" @click.stop>
            <div v-if="!item.isEdit" class="text-5 flex gap-5">
              <IconEdit @click="item.isEdit = true" />
              <IconDelete @click="deleteRole(item.id!)" />
            </div>
            <div v-else class="text-5 flex gap-5">
              <IconCheck @click="handleUpdate(item)" />
              <IconClose @click="getRoleList" />
            </div>
          </div>
        </li>
      </ul>
    </template>
  </a-popover>
</template>

<style lang="scss">
.role-popover {
  .arco-trigger-content {
    @apply flex max-h-[calc(100vh-56px)] flex-col rounded-t-xl py-4 px-0;

    .arco-popover-title {
      @apply p-4 pt-0;
    }

    .arco-popover-content {
      @apply flex-1 overflow-auto;
    }
  }
}
</style>
