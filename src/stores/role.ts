import { selectSQL, insertSQL, updateSQL, deleteSQL } from '@/sqls'

import type { TablePayload } from '@/types'

export const useRoleStore = defineStore(
  'roleStore',
  () => {
    const currentRole = ref<TablePayload>()

    const roleList = ref<TablePayload[]>()

    const getRoleList = async () => {
      roleList.value = await selectSQL('role')

      if (currentRole.value) {
        // 检查角色是否还存在
        const findRole = roleList.value.find(
          (role) => role.id === currentRole.value?.id
        )

        if (findRole) return
      }

      currentRole.value = roleList.value[0]
    }

    const addRole = async (payload: TablePayload) => {
      await insertSQL('role', payload)

      getRoleList()
    }

    const updateRole = async (payload: TablePayload) => {
      await updateSQL('role', payload)

      getRoleList()
    }

    const deleteRole = async (id: number) => {
      await deleteSQL('role', id)

      getRoleList()
    }

    onMounted(getRoleList)

    return { currentRole, roleList, addRole, updateRole, deleteRole }
  },
  {
    persist: {
      paths: ['currentRole']
    }
  }
)
