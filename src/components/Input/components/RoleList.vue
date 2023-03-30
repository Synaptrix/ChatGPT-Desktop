<script setup lang="ts">
import type { RolePayload } from '@/types'

const roleStore = useRoleStore()
const { getRoleList, updateRole, deleteRole, addRole } = roleStore
const { currentRole, roleList, filterRoleList, popoverVisible, isEdit } =
  storeToRefs(roleStore)

const { sessionDataList, currentSession } = storeToRefs(useSessionStore())

const isAdd = ref(false)

const renderList = computed(() => {
  return filterRoleList.value.length && !isAdd.value
    ? filterRoleList.value
    : roleList.value
})

watch(renderList, () => handleVisible(!!renderList.value.length))

const handleVisible = (value: boolean) => {
  if (sessionDataList.value.length || isAdd.value || isEdit.value) return

  popoverVisible.value = value
}

const handleAdd = () => {
  isAdd.value = true
  filterRoleList.value = []
  roleList.value = [{ name: '', description: '', isEdit: true }]
}

const handleClick = () => {
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

  if (!currentSession.value || !item.id) return

  currentRole.value = item
  currentSession.value.role_id = item.id

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
          class="transition-300 flex cursor-pointer items-center gap-4 bg-transparent p-4 text-[var(--color-text-1)] hover:bg-[var(--color-fill-2)]"
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
              <icon-edit @click="handleEdit(item)" />
              <a-popconfirm
                type="error"
                position="tr"
                content="确定删除该角色吗？"
                @ok="deleteRole(item.id!)"
              >
                <icon-delete />
              </a-popconfirm>
            </div>
            <div v-else class="text-5 flex gap-5">
              <icon-check @click="handleUpdate(item)" />
              <icon-close @click="handleClose" />
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
    --uno: flex max-h-[calc(100vh-56px)] flex-col rounded-t-xl py-4 px-0;

    .arco-popover-title {
      --uno: p-4 pt-0;
    }

    .arco-popover-content {
      --uno: flex-1 overflow-auto;
    }
  }
}
</style>
