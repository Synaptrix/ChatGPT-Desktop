import { deleteSQL, executeSQL, selectSQL } from '@/sqls'
import type { SessionPayload, SessionData, RecordData } from '@/types'
import { useRoleStore } from './role'
import { useSettingsStore } from './settings'

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
    // 流式回复
    const streamReply = ref('')

    const getSessionList = async () => {
      const sql =
        'SELECT session.*,role.name FROM session LEFT JOIN role ON role.id=session.role_id;'
      sessionList.value = (await executeSQL(sql)) as SessionPayload[]
    }

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

    // TODO: 是否为记忆对话
    // TODO: messageType从 types 中取到
    const addSessionData = async (
      isAsk: boolean,
      messageType: string,
      data: RecordData
    ) => {
      if (!currentSession.value) return
      // 检查会话是否已经存在
      const isExist = await checkSessionExist()

      const { currentRole } = useRoleStore()

      if (!isExist) {
        const sql = `INSERT INTO session (id, title, role_id) VALUES ('${currentSession.value.id}', '${data.content}', '${currentRole?.id}');`
        executeSQL(sql)
      }

      const { isMemory } = useSettingsStore()

      const sql = `INSERT INTO session_data (session_id, is_ask, is_memory, message) VALUES (
        '${currentSession.value.id}', ${isAsk}, ${isMemory}, '${JSON.stringify(
        data
      )}');`

      executeSQL(sql)
      getSessionData()
    }

    // 新建或切换会话
    const switchSession = (session?: SessionPayload) => {
      if (!session) createNewSession()
      else {
        currentSession.value = session
      }

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
      streamReply,
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
