import { selectSQL, insertSQL, updateSQL, deleteSQL } from '@/sqls'
import { getOpenAIResultApi } from '@/api'
import { useRoleStore } from '.'
import type { TablePayload, RecordData } from '@/types'

export const useRecordStore = defineStore('recordStore', () => {
  const currentRecord = ref<TablePayload>()

  const isThinking = ref(false)

  const recordList = ref<TablePayload[]>([])

  const createNewRecord = () => {
    currentRecord.value = undefined
  }

  const getAiMessage = async (value?: string) => {
    isThinking.value = true

    // TODO: 新建的记录的 sql 参数包含角色，后期考虑如何加
    if (!currentRecord.value && value) {
      const { currentRole } = useRoleStore()

      const newRecord: TablePayload = {
        title: value,
        data: []
      }

      newRecord.data?.push(
        {
          role: 'system',
          content: currentRole?.description || ''
        },
        {
          role: 'user',
          content: value
        }
      )

      currentRecord.value = newRecord

      addRecord()
    } else if (!value) {
      const newRecord = { ...currentRecord.value }
      newRecord.data?.pop()

      currentRecord.value = newRecord
    }

    const result = await getOpenAIResultApi()

    isThinking.value = false

    if (!result) return

    currentRecord.value?.data?.push(result?.message)

    updateRecord()
  }

  const getRecord = async () => {
    recordList.value = await selectSQL('history')

    if (currentRecord.value) {
      // 检查聊天记录是否还存在于数据库
      const findRecord = recordList.value.find(
        (record) => record.id === currentRecord.value?.id
      )

      if (findRecord) return

      currentRecord.value = undefined
    }
  }

  const addRecord = async () => {
    await insertSQL('history', currentRecord.value!)

    getRecord()
  }

  const updateRecord = async () => {
    await updateSQL('history', currentRecord.value!)

    getRecord()
  }

  const deleteRecord = async (deleteAll = false) => {
    if (deleteAll) {
      await deleteSQL('history')
    } else {
      await deleteSQL('history', currentRecord.value?.id)
    }

    getRecord()
  }

  onMounted(getRecord)

  return {
    currentRecord,
    isThinking,
    recordList,
    createNewRecord,
    getAiMessage,
    addRecord,
    updateRecord,
    deleteRecord
  }
})
