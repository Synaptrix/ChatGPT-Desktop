import type {
  SessionPayload,
  SessionData,
  MessageData,
  MessageType
} from '@/types'

export const useSessionStore = defineStore(
  'sessionStore',
  () => {
    // 当前会话
    const currentSession = ref<SessionPayload>()
    // 当前会话数据列表
    const sessionDataList = ref<SessionData[]>([])
    // 所有会话列表
    const sessionList = ref<SessionPayload[]>([])
    // 请求发送状态
    const isThinking = ref(false)
    // 停止请求
    const chatController = ref<AbortController>()

    // 获取会话列表
    const getSessionList = async () => {
      // TODO: 优化 sql
      const sql =
        'SELECT session.*, role.name FROM session LEFT JOIN role ON role.id=session.role_id ORDER BY session.update_time DESC;'

      const res = (await executeSQL(sql)) as SessionPayload[]
      sessionList.value = res.map((item) => ({ ...item, isEdit: false }))
    }

    // 获取当前会话数据
    const getSessionData = async () => {
      if (!currentSession.value) return

      const list = await selectSQL('session_data', [
        { key: 'session_id', value: currentSession.value.id }
      ])

      sessionDataList.value = list.reverse().map((item) => ({
        ...item,
        message: JSON.parse(item.message)
      }))
    }

    // 创建新会话
    const createNewSession = async () => {
      const defaultRole = (
        await selectSQL('role', [{ key: 'is_default', value: true }])
      )[0]

      currentSession.value = {
        id: crypto.randomUUID(),
        title: '',
        role_id: defaultRole.id
      }
    }

    // 添加当前对话数据
    const addSessionData = async (payload: {
      isAsk: boolean
      messageType?: MessageType
      data: MessageData
    }) => {
      if (!currentSession.value) return

      const { isAsk, messageType = 'text', data } = payload

      const isExist = await checkSessionExist()

      const { currentRole } = useRoleStore()

      if (!isExist && currentRole?.id) {
        currentSession.value.title = data.content
        await insertSQL('session', currentSession.value)
      }

      const { isMemory } = useSettingsStore()

      await insertSQL('session_data', {
        session_id: currentSession.value.id,
        is_ask: isAsk,
        is_memory: isMemory,
        message: data,
        message_type: messageType
      })

      await getSessionData()
    }

    // 更新当前对话数据
    const updateSessionData = async (payload: SessionData) => {
      await updateSQL('session_data', payload)
      await updateSession(currentSession.value!)
    }

    // 更新会话信息
    const updateSession = async (payload: SessionPayload) => {
      const sql = `UPDATE session SET title = '${
        payload.title
      }', update_time = '${Date.now()}' WHERE id = '${payload.id}';`
      await executeSQL(sql)
    }

    // 删除会话
    const deleteSession = async (session = currentSession.value) => {
      if (!session || !session.id) return

      // TODO: 优化 sql
      const sql1 = `DELETE FROM session_data WHERE session_id = '${session.id}';`
      const sql2 = `DELETE FROM session WHERE id = '${session.id}';`

      const sqlQueue = [executeSQL(sql1), executeSQL(sql2)]
      await Promise.all(sqlQueue)
      switchSession(currentSession.value)
    }

    // 检查会话是否存在
    const checkSessionExist = async () => {
      if (!currentSession.value) return

      const sessionList = await selectSQL('session', [
        { key: 'id', value: currentSession.value.id }
      ])

      return sessionList.length
    }

    // 新建或切换会话
    // TODO: 新建对话保持上一个角色
    const switchSession = async (session?: SessionPayload) => {
      if (!session) await createNewSession()
      else currentSession.value = session

      const { changeCurrentRole } = useRoleStore()

      changeCurrentRole()
      getSessionData()
      getSessionList()
    }

    onMounted(() => switchSession(currentSession.value))

    return {
      currentSession,
      sessionDataList,
      isThinking,
      sessionList,
      addSessionData,
      updateSessionData,
      switchSession,
      getSessionList,
      deleteSession,
      updateSession,
      chatController
    }
  },
  {
    persist: {
      paths: ['currentSession']
    }
  }
)
