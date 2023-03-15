/**
 * 判断数据是否为 null 或者 undefined
 * @param value 数据
 */
export const isNil = (value: any) => value == null

/**
 * 判断数据是否为字符串
 * @param value 数据
 */
export const isString = (value: any) => typeof value === 'string'

/**
 * 判断数据是否为对象
 * @param value 数据
 */
export const isObject = (value: any) => typeof value === 'object'

/**
 * 获取数组长度
 * @param value 数据
 */
export const getArrayLength = (value?: any[]) => value?.length ?? 0
