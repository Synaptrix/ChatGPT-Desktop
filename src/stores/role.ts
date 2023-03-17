import { selectSQL, insertSQL, updateSQL, deleteSQL, executeSQL } from '@/sqls'
import { useSessionStore } from '.'
import { Message } from '@arco-design/web-vue'
import type { RolePayload } from '@/types'

// BUG: useRoleStore 使用地方过多，在获取到角色列表然后如果没有当前角色赋值为第 0 个时出问题了，即便存储了 currentRole，但也是获取到 undefined
export const useRoleStore = defineStore(
  'roleStore',
  () => {
    // 当前选中的角色
    const currentRole = ref<RolePayload>()
    // 角色列表
    const roleList = ref<RolePayload[]>([])
    // 检索出来的角色列表
    const filterRoleList = ref<RolePayload[]>([])
    // 显示角色列表弹框
    const popoverVisible = ref(false)

    // 获取角色列表
    const getRoleList = async () => {
      const result = await selectSQL('role')

      roleList.value = result.map((item) => ({ ...item, isEdit: false }))
    }

    // 检索角色列表
    const getFilterRoleList = (value: string) => {
      if (value.startsWith('/')) {
        filterRoleList.value = roleList.value.filter(
          (item) => item.name === value.slice(1)
        )

        popoverVisible.value = !!filterRoleList.value.length
      }
    }

    // 添加角色
    const addRole = async (payload: RolePayload) => {
      await insertSQL('role', payload)

      getRoleList()
    }

    // 更新角色信息
    const updateRole = async (payload: RolePayload) => {
      await updateSQL('role', payload)

      getRoleList()
    }

    // 删除角色
    const deleteRole = async (id: number) => {
      // 删除角色前判读该角色下是否有会话
      const sessionLength = (
        await selectSQL('session', [{ key: 'role_id', value: id }])
      ).length

      if (sessionLength) {
        Message.error(
          `抱歉，当前角色有 ${sessionLength} 条历史会话，无法直接删除！`
        )

        return
      }

      await deleteSQL('role', id)

      getRoleList()
    }

    // 更改当前的角色
    const changeCurrentRole = () => {
      const { currentSession } = useSessionStore()

      currentRole.value = roleList.value.find(
        (item) => item.id === currentSession?.role_id
      )
    }

    onMounted(getRoleList)

    return {
      currentRole,
      roleList,
      popoverVisible,
      getRoleList,
      getFilterRoleList,
      addRole,
      updateRole,
      deleteRole,
      changeCurrentRole
    }
  },
  {
    persist: {
      paths: ['currentRole']
    }
  }
)
