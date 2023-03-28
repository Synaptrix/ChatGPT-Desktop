import { getName } from '@tauri-apps/api/app'
import { writeBinaryFile, BaseDirectory, copyFile } from '@tauri-apps/api/fs'
import { appConfigDir, downloadDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/api/shell'
import html2canvas from 'html2canvas'
import type { ImageSize, SAVE_TYPE } from '@/types'

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
      writeImage(buffer, 'image')
    })
  })

  setTimeout(() => {
    window[uuid] = null
  }, 3000)
}

export const saveImageFromBase64 = async (base64: string) => {
  const buffer = atob(base64)
    .split('')
    .map((c) => c.charCodeAt(0))

  const fileName = Date.now() + '.png'
  await writeImage(buffer, 'system', fileName)

  return fileName
}

export const saveImageFromFile = async (file: string) => {
  // 把对应的图片复制到下载文件夹
  await copyFile(`${await appConfigDir()}/${file}`, file, {
    dir: BaseDirectory.Download
  })

  open(await downloadDir())

  Message.success('下载成功')
}

const writeImage = async (
  buffer: number[] | ArrayBuffer,
  type: SAVE_TYPE,
  fileName?: string
) => {
  const uint8Array = new Uint8Array(buffer)

  if (type === 'system') {
    if (!fileName) return

    // 生成的图片
    return await writeBinaryFile(
      {
        path: fileName,
        contents: uint8Array
      },
      { dir: BaseDirectory.AppConfig }
    ).catch(() => {
      Message.error('图片加载失败，请重试！')
    })
  }

  // 用户下载的图片
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

  open(await downloadDir())

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
    // console.log(img.style)

    const width = img.style
    const height = img.height
    // return `${width}x${height}`
    return 0
  }

  return
}
