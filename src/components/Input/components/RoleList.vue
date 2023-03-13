<script lang="ts" setup>
import { updateSQL } from '@/sqls'
import { IconUser } from '@arco-design/web-vue/es/icon'
import { useRoleStore } from '@/stores'
import { selectSQL } from '@/sqls'
import type { RolePayload } from '@/types'

const { role } = storeToRefs(useRoleStore())

const roles = ref<RolePayload[]>([])

const getRoles = async () => {
  roles.value = await selectSQL('role', [{ key: 'is_deleted', value: false }])
}

const deleteRole = async (id: number) => {
  // TODO 弹窗确认，删除角色
  await updateSQL('role', {
    id,
    is_deleted: true
  })

  if (id === role.value?.id) role.value = undefined

  getRoles()
}

const updateRole = async (data: RolePayload) => {
  // TODO 弹窗确认，更新角色
  await updateSQL('role', data)

  getRoles()
}

onMounted(getRoles)

provide('deleteRole', deleteRole)
provide('updateRole', updateRole)
</script>

<template>
  <a-popover title="请选择对话的角色" trigger="click">
    <a-tooltip :content="role ? role.name : '请选择机器人角色'" position="tl">
      <icon-user v-if="!role" />
      <Avatar v-else :value="role.name" />
    </a-tooltip>
    <template #content>
      <a-list>
        <RoleItem
          :data="item"
          v-for="item in roles"
          :key="item.id"
          :class="{ 'bg-blue-100': role?.id === item.id }"
          @click="role = item"
        />
      </a-list>
    </template>
  </a-popover>
</template>

<style lang="scss" scoped></style>
