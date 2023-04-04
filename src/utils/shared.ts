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
 * 空函数
 */
export const NOOP = () => {
  /* empty */
}

/**
 * 获取数组/字符串最后一个元素
 */
export const getLastItem = <T>(arr: T[]) => arr[arr.length - 1]

/**
 * 节流
 * @param func 回调函数
 * @param delay 延迟时间
 */
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay = 3000
): T => {
  let lastTime = 0

  return ((...args: any[]) => {
    const currentTime = Date.now()
    if (currentTime - lastTime > delay) {
      lastTime = currentTime

      func.apply(this, args)
    }
  }) as T
}
