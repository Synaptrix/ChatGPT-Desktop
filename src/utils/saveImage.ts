import { writeBinaryFile, BaseDirectory } from '@tauri-apps/api/fs'
import * as htmlToImage from 'html-to-image'
import { Message } from '@arco-design/web-vue'
import { useSettingsStore } from '@/stores'
import { THEME } from '@/constants'
import { dialogErrorMessage } from './tauri'

/**
 * 下载图片
 * @param nodeRef
 */
export const saveImage = async (nodeId: string) => {
  try {
    const { themeMode } = useSettingsStore()

    const element = document.getElementById(nodeId) as HTMLElement

    const cloneElement = element.cloneNode(true) as HTMLElement

    document.body.appendChild(cloneElement)

    cloneElement.style.background =
      themeMode === THEME.light ? '#EEF0F2' : '#24272E'

    const dataUrl = await htmlToImage.toPng(cloneElement)

    // base64 转 buffer
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // 下载图片到 download 文件夹
    await writeBinaryFile(
      { path: `${Date.now()}.png`, contents: uint8Array },
      { dir: BaseDirectory.Download }
    )

    Message.success('图片导出成功！')

    document.body.removeChild(cloneElement)
  } catch ({ message }: any) {
    dialogErrorMessage(message)
  }
}
