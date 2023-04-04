import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'

export const saveMarkdown = throttle(async (content: any) => {
  try {
    const { currentSession } = useSessionStore()

    const file = `${currentSession?.title.slice(0, 10)}-${Date.now()}.md`

    await writeTextFile(file, content?.prompt || content, {
      dir: BaseDirectory.Download
    })

    openFilePath(file)

    Message.success('Markdown 文件导出成功')
  } catch (error) {
    Message.error('Markdown 文件导出失败，请重试！')
  }
})
