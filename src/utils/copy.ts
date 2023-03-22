import Clipboard from 'clipboard'
import { writeText } from '@tauri-apps/api/clipboard'
import { Message } from '@arco-design/web-vue'

type RulesArgs = [Array<{ content: string }>, number]

const PLUGIN_CLASS = 'code-copy'

new Clipboard(`.${PLUGIN_CLASS}`, {
  text: (trigger: HTMLElement) => {
    const uuid = trigger.getAttribute('data-uuid')
    const copyValue = trigger.getAttribute('data-clipboard-text')

    if (!uuid || !copyValue || window[uuid]) return ''

    trigger.classList.add('copied')

    window[uuid] = setTimeout(() => {
      trigger.classList.remove('copied')

      clearTimeout(window[uuid])
      window[uuid] = null
    }, 3000)

    return copyValue
  }
})

const renderCode = (originRule: (...args: RulesArgs) => string) => {
  return (...args: RulesArgs) => {
    const [tokens, idx] = args

    const content = tokens[idx].content

    const copyContent = content
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;')

    const originRendered = originRule(...args)

    if (!content) return originRendered

    return `
    <div class='relative'>
      ${originRendered}
      <div class="${PLUGIN_CLASS}" data-clipboard-text="${copyContent}" data-uuid="${crypto.randomUUID()}" title="复制代码"></div>
    </div>
    `
  }
}

export const copyCode = (md: any) => {
  md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block)
  md.renderer.rules.fence = renderCode(md.renderer.rules.fence)
}

export const copyText = async (
  event: MouseEvent,
  payload: { nodeId?: string; content?: string }
) => {
  try {
    const element = event.target as HTMLElement
    const id = '_' + element.getAttribute('id')

    if (!id || window[id]) {
      return
    }

    element.classList.add('active')

    window[id] = setTimeout(() => {
      element.classList.remove('active')

      clearTimeout(window[id])
      window[id] = null
    }, 3000)

    const { nodeId } = payload
    let { content } = payload

    if (nodeId) {
      content = document.getElementById(nodeId)?.innerText
    }

    if (!content) return

    await writeText(content)

    Message.success('复制成功')
  } catch (error) {
    Message.error('复制失败')
  }
}
