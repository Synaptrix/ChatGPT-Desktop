import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'

export const saveMarkdown = async (event: MouseEvent, content: any) => {
  try {
    const { currentSession } = useSessionStore()

    const element = event.target as HTMLElement
    const uuid = '_' + element.getAttribute('id')

    if (window[uuid]) return
    window[uuid] = uuid

    const file = `${currentSession?.title.slice(0, 10)}-${Date.now()}.md`

    await writeTextFile(file, content?.prompt || content, {
      dir: BaseDirectory.Download
    })

    setTimeout(() => {
      window[uuid] = null
    }, 3000)

    openFilePath(file)

    Message.success('Markdown 文件导出成功')
  } catch (error) {
    Message.error('Markdown 文件导出失败，请重试！')
  }
}
