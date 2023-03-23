import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'

export const saveMarkdown = async (event: MouseEvent, content: string) => {
  try {
    const { currentSession } = useSessionStore()

    const element = event.target as HTMLElement
    const uuid = '_' + element.getAttribute('id')

    if (window[uuid]) return
    window[uuid] = uuid

    await writeTextFile(`${currentSession?.title}-${Date.now()}.md`, content, {
      dir: BaseDirectory.Download
    })

    setTimeout(() => {
      window[uuid] = null
    }, 3000)

    Message.success('Markdown 文件导出成功')
  } catch (error) {
    Message.error('Markdown 文件导出失败，请重试！')
  }
}
