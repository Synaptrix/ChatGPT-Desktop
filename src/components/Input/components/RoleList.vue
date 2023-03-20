<script setup lang="ts">
import {
  IconEdit,
  IconCheck,
  IconDelete,
  IconClose
} from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { useRoleStore, useSessionStore } from '@/stores'
import type { RolePayload } from '@/types'

const roleStore = useRoleStore()
const { getRoleList, updateRole, deleteRole, addRole } = roleStore
const { currentRole, roleList, filterRoleList, popoverVisible } =
  storeToRefs(roleStore)

const { sessionDataList } = storeToRefs(useSessionStore())

const isAdd = ref(false)
const isEdit = computed(() => roleList.value.some((item) => item.isEdit))

const renderList = computed(() =>
  filterRoleList.value.length && !isAdd.value
    ? filterRoleList.value
    : roleList.value
)

const handleVisible = (value: boolean) => {
  if (sessionDataList.value.length || isAdd.value || isEdit.value) return

  popoverVisible.value = value
}

const handleAdd = () => {
  isAdd.value = true
  roleList.value = [{ name: '', description: '', isEdit: true }]
}

const handleClick = () => {
  getRoleList()

  if (sessionDataList.value.length) {
    Message.info({ content: '每个会话只能选择一个对话角色' })

    return
  }

  if (isAdd.value || isEdit.value) {
    const action = isAdd.value ? '添加' : '编辑'

    Message.info(`有角色正在${action}，无法关闭`)

    return
  }

  popoverVisible.value = !popoverVisible.value
}

const handleSelect = (item: RolePayload) => {
  if (item.isEdit) return

  if (isEdit.value) {
    Message.info(`有角色正在编辑，无法进行切换`)

    return
  }

  currentRole.value = item

  popoverVisible.value = false
}

const handleEdit = (item: RolePayload) => {
  if (isEdit.value) {
    Message.info(`一次只能编辑一个角色`)

    return
  }

  item.isEdit = true
}

const handleUpdate = (item: RolePayload) => {
  const { name, description } = item

  if (!name.trim() || !description.trim()) {
    Message.error('角色信息不能为空')

    return
  }

  if (isAdd.value) {
    addRole({ name, description })

    isAdd.value = false
  } else {
    delete item.isEdit

    updateRole(item)
  }
}

const handleClose = () => {
  isAdd.value = false

  getRoleList()
}
</script>

<!-- TODO: 优化代码 -->
<!-- 修改和添加后期可优化为modal，会省去很多代码和 bug -->
<template>
  <a-popover
    title="请选择对话的角色"
    class="role-popover w-full"
    trigger="click"
    :popup-visible="popoverVisible"
    @popup-visible-change="handleVisible"
  >
    <template #title>
      <div class="flex items-center justify-between">
        <span>{{ isAdd ? '请填写角色信息' : '请选择对话的角色' }}</span>
        <a-button type="outline" @click="handleAdd" v-if="!isAdd">
          添加角色
        </a-button>
      </div>
    </template>

    <a-tooltip content="对话角色" position="tl">
      <Avatar
        class="w-12! cursor-pointer"
        :value="currentRole?.name"
        @click="handleClick"
      />
    </a-tooltip>

    <template #content>
      <ul>
        <li
          v-for="item in renderList"
          class="flex cursor-pointer items-center gap-4 bg-transparent p-4 text-[var(--color-text-1)] transition hover:bg-[var(--color-fill-2)]"
          :class="{
            'bg-[rgb(var(--blue-6))]!': currentRole?.id === item.id,
            'bg-transparent!': item.isEdit,
            'text-white': currentRole?.id === item.id && !item.isEdit
          }"
          :key="item.id"
          @click="handleSelect(item)"
        >
          <div class="flex flex-1 items-center gap-4">
            <Avatar class="w-10!" :value="item.name" />

            <div class="flex flex-1 flex-col gap-2">
              <template v-if="!item.isEdit">
                <span>
                  {{ item.name }}
                </span>
                <span>
                  {{ item.description }}
                </span>
              </template>

              <template v-else>
                <a-input
                  v-model="item.name"
                  placeholder="请输入角色名称"
                  allow-clear
                  auto-focus
                />

                <a-textarea
                  v-model="item.description"
                  placeholder="请输入角色描述"
                  auto-size
                  allow-clear
                />
              </template>
            </div>
          </div>

          <div v-if="!item.is_default" @click.stop>
            <div v-if="!item.isEdit" class="text-5 flex gap-5">
              <IconEdit @click="handleEdit(item)" />
              <IconDelete @click="deleteRole(item.id!)" />
            </div>
            <div v-else class="text-5 flex gap-5">
              <IconCheck @click="handleUpdate(item)" />
              <IconClose @click="handleClose" />
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
      @apply mt-0 flex-1 overflow-auto;
    }
  }
}
</style>
