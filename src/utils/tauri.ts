import { invoke } from '@tauri-apps/api/tauri'
import { downloadDir } from '@tauri-apps/api/path'
import { type } from '@tauri-apps/api/os'
import { appWindow, PhysicalSize } from '@tauri-apps/api/window'
import { hide, show } from '@tauri-apps/api/app'
import { currentMonitor } from '@tauri-apps/api/window'

/**
 * 打开文件所在位置
 * @param file 文件
 */
export const openFilePath = async (file: string) => {
  await invoke('show_in_folder', {
    path: (await downloadDir()) + file
  })
}

/**
 * 显示窗口
 */
export const showWindow = async () => {
  const platform = await type()

  appWindow.unminimize()

  if (platform === 'Darwin') {
    show()
  } else {
    appWindow.show()
  }

  appWindow.setFocus()
}

/**
 * 隐藏窗口
 */
export const hideWindow = async () => {
  const platform = await type()

  if (platform === 'Darwin') {
    hide()
  } else {
    appWindow.hide()
  }
}

export const resizeWindow = async () => {
  const monitor = await currentMonitor()

  if (!monitor) return

  const resizeHeight = Math.ceil(monitor.size.height * (600 / 1080))
  const resizeWidth = Math.ceil(resizeHeight * 1.3)

  appWindow.setSize(new PhysicalSize(resizeWidth, resizeHeight))
}
