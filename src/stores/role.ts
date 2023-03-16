import { selectSQL, insertSQL, updateSQL, deleteSQL } from '@/sqls'
import type { RolePayload } from '@/types'

export const useRoleStore = defineStore(
  'roleStore',
  () => {
    // 当前选中的角色
    const currentRole = ref<RolePayload>()
    // 角色列表
    const roleList = ref<RolePayload[]>([])
    const filterList = ref<RolePayload[]>([])

    const isShow = ref(false)
    const isAddNew = ref(false)
    // 获取角色列表
    const getRoleList = async () => {
      const result = await selectSQL('role')

      isAddNew.value = false
      defaultRole.value.length = 0

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

    const getFilterRoleList = (value: string) => {
      if (value.trim().length && value.startsWith('/')) {
        filterList.value = roleList.value.filter((item: any) => {
          return item.name.includes(value.slice(1))
        })

        isShow.value = filterList.value.length > 0
        return
      }
      isShow.value = false
      filterList.value.length = 0
    }

    const changeCurrentRole = (id: number) => {
      const findRole = roleList.value.find((role) => role.id === id)
      if (!findRole) return
      currentRole.value = findRole
    }

    const addRole = async (payload: RolePayload) => {
      await insertSQL('role', payload as any)

      getRoleList()
    }

    const updateRole = async (payload: RolePayload) => {
      const { name, description, id } = payload
      await updateSQL('role', { name, description, id } as any)

      getRoleList()
    }

    const deleteRole = async (id: number) => {
      await deleteSQL('role', id)

      getRoleList()
    }

    const defaultRole = ref<RolePayload[]>([])

    const showList = computed(() => {
      if (isAddNew.value) {
        defaultRole.value.push({
          id: 99999,
          name: '',
          description: '',
          isEdit: true,
          is_default: false
        })
        return defaultRole.value
      }
      const res =
        filterList.value.length > 0 ? filterList.value : roleList.value
      res.forEach((item) => (item.isEdit = false))
      return res
    })

    onMounted(getRoleList)

    return {
      isShow,
      isAddNew,
      getFilterRoleList,
      getRoleList,
      showList,
      currentRole,
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
