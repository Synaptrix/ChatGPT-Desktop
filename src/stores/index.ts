import { Store } from 'tauri-plugin-store-api'
import { STORE_DEFAULT_VALUES, FILE_STORAGE_PATH } from '@/constants'
import { isNil } from '@/utils'

// 创建配置文件
const storeFile = import.meta.env.DEV ? '.config.dev.dat' : '.config.dat'
const store = new Store(`${FILE_STORAGE_PATH}/${storeFile}`)

/**
 * 初始化 store 配置
 */
export const initStore = async () => {
  try {
    await store.load()
    // 合并初始配置和用户自定义配置，防止缺少配置项
    for (const key of Object.keys(STORE_DEFAULT_VALUES)) {
      const value = (await getStore(key)) || STORE_DEFAULT_VALUES[key]
      await setStore(key, value)
    }
    await saveStore()
  } catch (error) {
    for (const key of Object.keys(STORE_DEFAULT_VALUES)) {
      const defaultValue = STORE_DEFAULT_VALUES[key]
      await setStore(key, defaultValue)
    }
  }
}

/**
 * 从 store 获取属性值
 * @param key 获取值的属性名
 * @returns 属性值
 */
export const getStore = async (key: string, defaultValue?: any) => {
  const value = await store.get(key)

  return !isNil(value) ? JSON.parse(value as string) : defaultValue
}

/**
 * 在 store 写入属性
 * @param key 需要设置的值的属性名
 * @param value 需要设置的值的属性名
 */
export const setStore = async (key: string, value: string | boolean) => {
  if (isNil(value)) {
    deleteStore(key)

    return
  }

  await store.set(key, JSON.stringify(value))

  await saveStore()
}

/**
 * 写入配置文件
 */
export const saveStore = async () => {
  try {
    await store.save()
  } catch (error) {
    throw new Error('数据写入配置文件时遇到了问题，请重试！')
  }
}

/**
 * 删除配置参数
 * @param key 要删除的参数的属性名
 */
export const deleteStore = async (key: string) => {
  await store.delete(key)

  await saveStore()
}

/**
 * 清空所有配置
 */
export const clearStore = async () => {
  await store.clear()

  await saveStore()
}
