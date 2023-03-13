import { selectSQL } from '@/sqls'
import type { TablePayload } from '@/types'

export const useRoleStore = defineStore(
  'roleStore',
  () => {
    const currentRole = ref<TablePayload>()

    const roleList = ref<TablePayload[]>()

    onMounted(async () => {
      roleList.value = await selectSQL('role')

      if (currentRole.value) {
        // 检查角色是否还存在
        const findRole = roleList.value.find(
          (role) => role.id === currentRole.value!.id
        )

        if (findRole) return
      }

      currentRole.value = roleList.value[0]
    })

    return { currentRole, roleList }
  },
  {
    persist: {
      paths: ['currentRole']
    }
  }
)
