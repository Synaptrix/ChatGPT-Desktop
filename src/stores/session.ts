import { nanoid } from 'nanoid'
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
    // 图片的参数
    const imageParams = reactive({
      number: 1,
      size: '256x256'
    })

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
        id: nanoid(),
        title: '',
        role_id: defaultRole.id,
        type: currentSession.value?.type || 'text'
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
        const title =
          currentSession.value.type === 'text'
            ? data.content
            : data.content.prompt

        currentSession.value.title = title

        await insertSQL('session', {
          id: currentSession.value.id,
          title: title,
          role_id: currentRole.id,
          type: currentSession.value.type
        })
      }

      if (messageType === 'text') {
        const { isMemory } = useSettingsStore()

        await insertSQL('session_data', {
          session_id: currentSession.value.id,
          is_ask: isAsk,
          is_memory: isMemory,
          message: data,
          message_type: 'text'
        })
      } else if (messageType === 'image') {
        await insertSQL('session_data', {
          session_id: currentSession.value.id,
          is_ask: isAsk,
          is_memory: false,
          message: data,
          message_type: 'image'
        })
      }

      await getSessionData()
    }

    // 更新当前对话数据
    const updateSessionData = async (payload: SessionData) => {
      await updateSQL('session_data', payload)
      await updateSession(currentSession.value!)
    }

    // 删除一条对话数据
    const deleteSessionData = async (payload: SessionData) => {
      if (sessionDataList.value.length === 1) {
        await deleteSession()
      } else {
        const { id, session_id } = payload
        const sql = `DELETE FROM session_data WHERE id = '${id}' AND session_id = '${session_id}';`
        await executeSQL(sql)
      }

      Message.success('删除成功')

      getSessionData()
    }

    // 更新会话信息
    const updateSession = async (payload: SessionPayload) => {
      const newPayload = { ...payload }
      delete newPayload.name
      delete newPayload.isEdit

      await updateSQL('session', {
        ...newPayload,
        update_time: Date.now().toString()
      })
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
    const switchSession = async (session?: SessionPayload) => {
      const { currentRole } = useRoleStore()

      if (!session || !Object.keys(session).length || !currentRole)
        await createNewSession()
      else {
        // !!!添加了新的字段后，旧的session可能不存在type字段，需要处理一下
        if (!session?.type) session.type = 'text'
        currentSession.value = session
      }

      sessionDataList.value.length = 0
      setTimeout(() => {
        const { changeCurrentRole } = useRoleStore()

        changeCurrentRole()
        getSessionData()
        getSessionList()
      }, 50)
    }

    // 修改最后一个对话内容
    const changeLastSessionContent = (content = '未知错误') => {
      const lastDate = getLastItem(sessionDataList.value)
      if (!lastDate.message.content) {
        lastDate.message.content = content
      }
    }

    onMounted(() => switchSession(currentSession.value))

    return {
      currentSession,
      sessionDataList,
      isThinking,
      sessionList,
      chatController,
      imageParams,
      addSessionData,
      updateSessionData,
      deleteSessionData,
      switchSession,
      getSessionList,
      deleteSession,
      updateSession,
      changeLastSessionContent
    }
  },
  {
    persist: {
      paths: ['currentSession']
    }
  }
)
