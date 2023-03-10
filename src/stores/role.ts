import { executeSQL } from '@/sqls'
import type { RolePayload } from '@/types'

export const useRoleStore = defineStore(
  'roleStore',
  () => {
    const role = ref<RolePayload>()

    onMounted(async () => {
      if (!role.value) return
      // 检查当前的角色是否还存在
      // TODO 优化SQL-WHERE条件查询
      const sql = `SELECT * FROM role WHERE id = ${role.value?.id} AND is_deleted = 0;`
      const res = (await executeSQL(sql)) as RolePayload[]
      if (!res.length) {
        role.value = undefined
      }
    })

    return { role }
  },
  {
    persist: true
  }
)
