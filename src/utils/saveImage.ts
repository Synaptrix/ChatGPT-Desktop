import { getName } from '@tauri-apps/api/app'
import {
  writeBinaryFile,
  BaseDirectory,
  copyFile,
  readDir,
  createDir
} from '@tauri-apps/api/fs'
import { appConfigDir, sep } from '@tauri-apps/api/path'
import html2canvas from 'html2canvas'
import type { SaveType } from '@/types'

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
  const targetFile = `${await getName()}-${file}`

  // 把对应的图片复制到下载文件夹
  await copyFile(
    `${await appConfigDir()}${sep}images/${sep}${file}`,
    targetFile,
    {
      dir: BaseDirectory.Download
    }
  )

  openFilePath(targetFile)

  Message.success('下载成功')
}

const writeImage = async (
  buffer: number[] | ArrayBuffer,
  type: SaveType,
  fileName?: string
) => {
  const uint8Array = new Uint8Array(buffer)

  if (type === 'system') {
    if (!fileName) return

    const folder = (await appConfigDir()) + sep + 'images'

    await readDir(folder).catch(async () => {
      await createDir(folder)
    })

    // 生成的图片
    return await writeBinaryFile(
      {
        path: folder + sep + fileName,
        contents: uint8Array
      },
      { dir: BaseDirectory.AppConfig }
    ).catch(() => {
      Message.error('图片加载失败，请重试！')
    })
  }

  // 用户下载的图片
  const path = `${await getName()}-${Date.now()}.png`

  await writeBinaryFile(
    {
      path,
      contents: uint8Array
    },
    { dir: BaseDirectory.Download }
  ).catch(() => {
    Message.error('图片导出失败，请重试！')
  })

  openFilePath(path)

  Message.success('图片导出成功')
}
