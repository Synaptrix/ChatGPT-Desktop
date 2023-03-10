<script lang="ts" setup>
import { executeSQL, softDeleteSQL, updateSQL } from '@/sqls'
import { IconUser } from '@arco-design/web-vue/es/icon'

import type { RolePayload } from '@/types'
import { useRoleStore } from '@/stores'
const { role } = storeToRefs(useRoleStore())

const roles = ref<RolePayload[]>([])

const getRoles = async () => {
  const sql = `SELECT * FROM role WHERE is_deleted = 0 ORDER BY id DESC;`
  roles.value = (await executeSQL(sql)) as RolePayload[]
}

const deleteRole = async (id: number) => {
  // TODO 弹窗确认，删除角色
  await softDeleteSQL('role', id)
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
