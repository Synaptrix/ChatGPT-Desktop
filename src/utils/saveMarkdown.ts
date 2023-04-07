import { getName } from '@tauri-apps/api/app'
import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'

const { t } = i18n.global

export const saveMarkdown = throttle(async (content: any) => {
  try {
    const file = `${await getName()}-${Date.now()}.md`

    await writeTextFile(file, content?.prompt || content, {
      dir: BaseDirectory.Download
    })

    openFilePath(file)

    Message.success(t('message.exportMarkdownSuccess'))
  } catch (error) {
    Message.error(t('message.exportMarkdownFail'))
  }
})
