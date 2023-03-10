import { configDir } from '@tauri-apps/api/path'
import Database from 'tauri-plugin-sql-api'
import { dialogErrorMessage } from '@/utils'
import { isString, isObject } from '@/utils'
import type { TableName, TablePayload } from '@/types'

const dbFile = import.meta.env.DEV ? 'sql.dev.db' : 'sql.db'
const db = await Database.load(
  `sqlite:${await configDir()}/${import.meta.env.VITE_APP_NAME}/${dbFile}`
)

/**
 * 执行 sql 语句
 * @param sql sql 语句
 */
export const executeSQL = async (sql: string) => {
  const sliceSQL = sql.slice(0, 6)

  try {
    if (sliceSQL === 'SELECT') {
      return await db.select(sql)
    } else {
      await db.execute(sql)
    }
  } catch (error) {
    console.log('error', error)

    let action = '创建'

    if (sliceSQL === 'SELECT') {
      action = '获取'
    } else if (sliceSQL === 'INSERT') {
      action = '添加'
    } else if (sliceSQL === 'UPDATE') {
      action = '更新'
    } else if (sliceSQL === 'DELETE') {
      action = '删除'
    }

    dialogErrorMessage(`${action}数据时遇到了问题，请重试~`)
  }
}

/**
 * 初始化 sql 配置
 */
export const initSQL = () => {
  executeSQL(
    `
    CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, data TEXT, role_id INTEGER, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS role (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT);
    CREATE TABLE IF NOT EXISTS credit (id INTEGER PRIMARY KEY AUTOINCREMENT, history_id INTEGER, token_cost INTEGER, api_key TEXT);
    `
  )
}

/**
 * 查找的 sql 语句
 * @param tableName 表名称
 * @returns
 */
export const selectSQL = async (tableName: TableName) => {
  return (await executeSQL(`SELECT * FROM ${tableName} ORDER BY id;`)) as any[]
}

/**
 * 添加的 sql 语句
 * @param tableName 表名称
 * @param payload 添加的数据
 */
export const insertSQL = async (
  tableName: TableName,
  payload: TablePayload
) => {
  const insertKeys = [],
    insertValues = []

  for (const key in payload) {
    insertKeys.push(key)

    let value = payload[key as keyof typeof payload]

    if (isObject(value)) {
      value = JSON.stringify(value)
    }

    insertValues.push(isString(value) ? `'${value}'` : value)
  }

  await executeSQL(
    `INSERT INTO ${tableName} (${insertKeys.join()}) VALUES (${insertValues.join()});`
  )
}

/**
 * 更新的 sql 语句
 * @param tableName 表名称
 * @param payload 修改的数据
 */
export const updateSQL = async (
  tableName: TableName,
  payload: TablePayload
) => {
  const id = payload.id

  delete payload.id

  const updateParams: string[] = []

  for (const key in payload) {
    let value = payload[key as keyof typeof payload]

    if (isObject(value)) {
      value = `'${JSON.stringify(value)}'`
    } else if (isString(value)) {
      value = `'${value}'`
    }

    updateParams.push(`${key}=${value}`)
  }

  await executeSQL(
    `UPDATE ${tableName} SET ${updateParams.join()} WHERE id=${id};`
  )
}

/**
 * 删除的 sql 语句
 * @param tableName 表名称
 * @param id 删除数据的 id
 */
export const deleteSQL = async (tableName: TableName, id?: number) => {
  if (id) {
    await executeSQL(`DELETE FROM ${tableName} WHERE id=${id};`)
  } else {
    await executeSQL(`DELETE FROM ${tableName};`)
  }
}
