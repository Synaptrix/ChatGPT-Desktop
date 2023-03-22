import { useSessionStore } from '@/stores'
import { Message } from '@arco-design/web-vue'
import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'

export const saveMarkdown = async (content: string) => {
  try {
    const { currentSession } = useSessionStore()
    await writeTextFile(`${currentSession?.title}-${Date.now()}.md`, content, {
      dir: BaseDirectory.Download
    })
    Message.success('Markdown导出成功')
  } catch (error) {
    Message.error('Markdown导出失败，请重试！')
  }
}
