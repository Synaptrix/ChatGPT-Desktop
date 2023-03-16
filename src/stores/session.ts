import { executeSQL } from '@/sqls'
import type { SessionPayload, SessionData, RecordData } from '@/types'
import { useRoleStore } from './role'

// TODO: 无记忆对话和有记忆对话
// 用来管理当前会话的状态
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

    const getSessionList = async () => {
      const sql =
        'SELECT session.*,role.name FROM session LEFT JOIN role ON role.id=session.role_id;'
      sessionList.value = (await executeSQL(sql)) as SessionPayload[]
    }

    const createNewSession = () => {
      currentSession.value = {
        id: crypto.randomUUID(),
        title: '',
        role_id: 0
      }
    }

    const deleteSession = async (session = currentSession.value) => {
      if (!session) return
      if (!session.id) return

      const sql1 = `DELETE FROM session_data WHERE session_id = '${session.id}';`
      const sql2 = `DELETE FROM session WHERE id = '${session.id}';`

      const sqlQueue = [executeSQL(sql1), executeSQL(sql2)]
      await Promise.all(sqlQueue)
      switchSession(currentSession.value)
    }

    const getSessionData = async () => {
      if (!currentSession.value) return

      const sql = `SELECT * FROM session_data WHERE session_id = '${currentSession.value.id}';`
      sessionDataList.value = (await executeSQL(sql)) as SessionData[]
    }

    const checkSessionExist = async () => {
      if (!currentSession.value) return

      const sql = `SELECT * FROM session WHERE id = '${currentSession.value.id}';`
      const result = (await executeSQL(sql)) as SessionPayload[]
      return result.length > 0
    }

    const { changeCurrentRole, currentRole } = useRoleStore()

    // TODO: 是否为记忆对话
    // TODO: messageType从 types 中取到
    const addSessionData = async (
      isAsk: boolean,
      messageType: string,
      data: RecordData[]
    ) => {
      if (!currentSession.value) return
      // 检查会话是否已经存在
      const isExist = await checkSessionExist()

      if (!isExist) {
        const sql = `INSERT INTO session (id, title, role_id) VALUES ('${currentSession.value.id}', '${data[1].content}', '${currentRole?.id}');`
        executeSQL(sql)
      }

      const sql = `INSERT INTO session_data (session_id, is_ask, messages) VALUES (
        '${currentSession.value.id}','${isAsk}', '${JSON.stringify(data)}');`

      executeSQL(sql)
      getSessionData()
    }

    // 新建或切换会话
    const switchSession = (session?: SessionPayload) => {
      if (!session) createNewSession()
      else {
        currentSession.value = session
      }
      changeCurrentRole()
      getSessionData()
    }

    onMounted(() => switchSession(currentSession.value))

    return {
      currentSession,
      sessionDataList,
      isThinking,
      sessionList,
      addSessionData,
      switchSession,
      getSessionList,
      deleteSession
    }
  },
  {
    persist: {
      paths: ['currentSession']
    }
  }
)
