import { selectSQL, insertSQL, updateSQL, deleteSQL } from '@/sqls'
import type { TablePayload, RecordData } from '@/types'

export const useRecordStore = defineStore('recordStore', () => {
  const currentRecord = ref<number>()

  const recordList = ref<RecordData[]>([])

  const getRecord = async () => {
    recordList.value = await selectSQL('history')
  }

  const addRecord = async (payload: TablePayload) => {
    await insertSQL('history', payload)

    getRecord()
  }

  const updateRecord = async (payload: TablePayload) => {
    await updateSQL('history', payload)

    getRecord()
  }

  const deleteRecord = async (id?: number) => {
    await deleteSQL('history', id)

    getRecord()
  }

  onMounted(getRecord)

  return { currentRecord, recordList, addRecord, updateRecord, deleteRecord }
})
