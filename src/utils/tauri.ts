import { invoke } from '@tauri-apps/api/tauri'
import { downloadDir } from '@tauri-apps/api/path'

/**
 * 打开文件所在位置
 * @param file 文件
 */
export const openFilePath = async (file: string) => {
  await invoke('show_in_folder', {
    path: (await downloadDir()) + file
  })
}
