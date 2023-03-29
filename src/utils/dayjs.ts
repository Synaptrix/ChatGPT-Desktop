import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

/**
 * 获取当地时间
 * @param time 原来的时间
 */
export const getLocalTime = (time: string) => {
  if (!time) return

  const timeSplit = time.split(' ')

  if (timeSplit.length > 2) {
    timeSplit.splice(2)

    time = timeSplit.join(' ')
  }

  return dayjs.utc(time).local().format('YYYY-MM-DD HH:mm:ss')
}
