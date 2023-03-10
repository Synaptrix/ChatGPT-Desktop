import { selectSQL, insertSQL, updateSQL, deleteSQL } from '@/sqls'
import type { HistoryRecord, RecordData } from '@/types'

export const useRecordStore = defineStore('recordStore', () => {
  const currentRecord = ref<number>()

  const recordList = ref<HistoryRecord[]>([])

  const getRecord = async () => {
    recordList.value = await selectSQL()
  }

  const addRecord = async (data: RecordData[]) => {
    await insertSQL(data)

    getRecord()
  }

  const updateRecord = async (id: number, payload: HistoryRecord) => {
    await updateSQL(id, payload)

    getRecord()
  }

  const deleteRecord = async (id?: number) => {
    await deleteSQL(id)

    getRecord()
  }

  onMounted(getRecord)

  return { currentRecord, recordList, addRecord, updateRecord, deleteRecord }
})
