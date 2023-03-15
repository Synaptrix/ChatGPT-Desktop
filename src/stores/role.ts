import { selectSQL, insertSQL, updateSQL, deleteSQL } from '@/sqls'

import type { RolePayload } from '@/types'

export const useRoleStore = defineStore(
  'roleStore',
  () => {
    const currentRole = ref<RolePayload>()

    const roleList = ref<RolePayload[]>([])

    const getRoleList = async () => {
      const result = await selectSQL('role')

      roleList.value = result.map((item) => ({ ...item, isEdit: false }))

      if (currentRole.value) {
        // 检查角色是否还存在
        const findRole = roleList.value.find(
          (role) => role.id === currentRole.value?.id
        )

        if (findRole) return
      }

      currentRole.value = roleList.value[0]
    }

    const addRole = async (payload: RolePayload) => {
      await insertSQL('role', payload)

      getRoleList()
    }

    const updateRole = async (payload: RolePayload) => {
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
