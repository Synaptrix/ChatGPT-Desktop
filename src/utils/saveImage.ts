import { writeBinaryFile, BaseDirectory } from '@tauri-apps/api/fs'
import html2canvas from 'html2canvas'

/**
 * 下载图片
 * @param nodeRef
 */
export const saveImage = async (nodeId: string) => {
  try {
    const uuid = '_' + nodeId

    if (window[uuid]) return

    window[uuid] = uuid

    const element = document.getElementById(nodeId)

    if (!element) throw new Error()

    const cloneElement = element.cloneNode(true) as HTMLElement

    cloneElement.style.padding = '20px'

    document.body.appendChild(cloneElement)

    const canvas = await html2canvas(cloneElement, {
      backgroundColor: document.body.getAttribute('arco-theme')
        ? '#fff'
        : '#000'
    })

    // base64 转 buffer
    const response = await fetch(canvas.toDataURL('image/png'))
    const uint8Array = new Uint8Array(await response.arrayBuffer())

    // 下载图片到 download 文件夹
    await writeBinaryFile(
      {
        path: `ChatGPT-Desktop-${Date.now()}.png`,
        contents: uint8Array
      },
      { dir: BaseDirectory.Download }
    )

    setTimeout(() => {
      window[uuid] = null
      document.body.removeChild(cloneElement)
    }, 3000)

    Message.success('图片导出成功')
  } catch (error) {
    Message.error('图片导出失败，请重试！')
  }
}
