import { configDir } from '@tauri-apps/api/path'
import { version } from '../../package.json'

// 默认配置文件路径
export const FILE_STORAGE_PATH =
  (await configDir()) + import.meta.env.VITE_APP_NAME

// store 初始默认值
export const STORE_DEFAULT_VALUES: Record<string, any> = {
  version,
  'theme-mode': 'light'
}
