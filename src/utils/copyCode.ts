import Clipboard from 'clipboard'

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

    const originRendered = originRule(...args)

    if (!content) return originRendered

    return `
    <div class='relative'>
      ${originRendered}
      <div class="${PLUGIN_CLASS}" data-clipboard-text="${content}" data-uuid="${crypto.randomUUID()}" title="复制代码"></div>
    </div>
    `
  }
}

export const copyCode = (md: any) => {
  md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block)
  md.renderer.rules.fence = renderCode(md.renderer.rules.fence)
}
