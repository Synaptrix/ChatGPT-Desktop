import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'
import { downloadDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/api/shell'

export const saveMarkdown = async (event: MouseEvent, content: any) => {
  try {
    const { currentSession } = useSessionStore()

    const element = event.target as HTMLElement
    const uuid = '_' + element.getAttribute('id')

    if (window[uuid]) return
    window[uuid] = uuid

    await writeTextFile(
      `${currentSession?.title}-${Date.now()}.md`,
      content?.prompt || content,
      {
        dir: BaseDirectory.Download
      }
    )

    setTimeout(() => {
      window[uuid] = null
    }, 3000)

    open(await downloadDir())

    Message.success('Markdown 文件导出成功')
  } catch (error) {
    Message.error('Markdown 文件导出失败，请重试！')
  }
}
