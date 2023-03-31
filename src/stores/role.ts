import type { RolePayload } from '@/types'

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
    // 检索角色列表的输入框值
    const textAreaValue = ref('')
    // 是否有角色正在编辑
    const isEdit = computed(() => roleList.value.some((item) => item.isEdit))

    watch(textAreaValue, (val) => {
      const { sessionDataList } = useSessionStore()
      if (sessionDataList.length) return
      if (val.startsWith('/')) {
        popoverVisible.value = true
        getFilterRoleList()
      } else {
        popoverVisible.value = false
      }
    })

    watch(popoverVisible, (val) => {
      if (val) return getRoleList()

      roleList.value.length = 0
      filterRoleList.value.length = 0
    })

    // 获取角色列表
    const getRoleList = async () => {
      const result = await selectSQL('role')

      roleList.value = result.map((item) => ({ ...item, isEdit: false }))
    }

    // 检索角色列表
    const getFilterRoleList = () => {
      if (textAreaValue.value === '/') return

      filterRoleList.value.length = 0
      filterRoleList.value = roleList.value.filter((item) =>
        item.name.includes(textAreaValue.value.slice(1))
      )
      if (!filterRoleList.value.length) {
        roleList.value.length = 0
        popoverVisible.value = false
      }
    }

    // 添加角色
    const addRole = async (payload: RolePayload) => {
      await insertSQL('role', payload)

      getRoleList()
    }

    // 更新角色信息
    const updateRole = async (payload?: RolePayload) => {
      if (!payload) payload = currentRole.value!

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

      await getRoleList()

      const { currentSession } = storeToRefs(useSessionStore())

      const findRole = roleList.value.find(
        (item) => item.id === currentRole.value?.id
      )

      if (!findRole) {
        currentRole.value = roleList.value.find((item) => item.is_default)

        if (currentSession.value?.role_id === id) {
          currentSession.value.role_id = currentRole.value?.id as number
        }
      }
    }

    // 更改当前的角色
    const changeCurrentRole = async () => {
      const { currentSession } = useSessionStore()

      currentRole.value = (
        await selectSQL('role', [{ key: 'id', value: currentSession?.role_id }])
      )[0]
    }

    return {
      currentRole,
      roleList,
      filterRoleList,
      popoverVisible,
      textAreaValue,
      isEdit,
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
