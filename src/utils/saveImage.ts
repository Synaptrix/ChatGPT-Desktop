import type { ImageSize } from '@/types'
import { getName } from '@tauri-apps/api/app'
import { writeBinaryFile, BaseDirectory } from '@tauri-apps/api/fs'
import html2canvas from 'html2canvas'

/**
 * 下载图片
 * @param nodeRef
 */
export const saveImage = async (nodeId: string) => {
  const uuid = '_' + nodeId

  if (window[uuid]) return

  window[uuid] = uuid

  const element = document.getElementById(nodeId)

  if (!element) throw new Error()

  const cloneElement = element.cloneNode(true) as HTMLElement

  cloneElement.style.padding = '20px'

  document.body.appendChild(cloneElement)

  const canvas = await html2canvas(cloneElement, {
    backgroundColor:
      document.body.getAttribute('arco-theme') === 'light' ? '#fff' : '#000'
  })

  canvas.toBlob(async (blob) => {
    blob?.arrayBuffer().then((buffer) => {
      writeImage(buffer)
    })
  })
}

export const saveImageFromBase64 = async (base64: string) => {
  const buffer = atob(base64)
    .split('')
    .map((c) => c.charCodeAt(0))

  writeImage(buffer)
}

const writeImage = async (buffer: number[] | ArrayBuffer) => {
  const uint8Array = new Uint8Array(buffer)

  const appName = await getName()

  await writeBinaryFile(
    {
      path: `${appName}-${Date.now()}.png`,
      contents: uint8Array
    },
    { dir: BaseDirectory.Download }
  ).catch(() => {
    Message.error('图片导出失败，请重试！')
  })

  Message.success('图片导出成功')
}

export const calcImageSize = (base64: string): ImageSize | undefined => {
  // base64 编码的图像
  const url = `data:image/png;base64,${base64}}`

  // 创建一个新的 Image 对象
  const img = new Image()

  // 将 URL 赋值给 Image 对象的 src 属性
  img.src = url

  // 在 Image 对象的 onload 事件中获取图像的宽度和高度
  img.onload = () => {
    const width = img.width
    const height = img.height
    // return `${width}x${height}`
    return 0
  }

  return
}
