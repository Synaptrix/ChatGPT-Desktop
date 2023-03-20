// @unocss-include
import Clipboard from 'clipboard'

const PLUGIN_CLASS = 'code-copy'

new Clipboard(`.${PLUGIN_CLASS}`, {
  text: (trigger: HTMLButtonElement) => {
    trigger.classList.add('i-mdi-checkbox-multiple-marked-outline')
    setTimeout(() => {
      trigger.classList.remove('i-mdi-checkbox-multiple-marked-outline')
    }, 2000)
    return trigger.getAttribute('data-clipboard-text') ?? ''
  }
})

interface Options {
  buttonClass?: string
}

type RulesArgs = [Array<{ content: string }>, number]

const defaultOptions: Options = {
  buttonClass:
    'text-white h-5 absolute cursor-pointer i-mdi-checkbox-multiple-blank-outline top-6 right-2'
}

const renderCode = (
  origRule: (...args: RulesArgs) => string,
  options: Options
) => {
  options = { ...defaultOptions, ...options }
  return (...args: RulesArgs) => {
    const [tokens, idx] = args
    const content = tokens[idx].content
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&lt;')
    const origRendered = origRule(...args)

    if (content.length === 0) {
      return origRendered
    }

    return `
<div style="position: relative">
	${origRendered}
	<button class="${PLUGIN_CLASS} ${
      options.buttonClass ?? ''
    }" data-clipboard-text="${content}"  title="Copy code">
	</button>
</div>
`
  }
}

export default (md: any, options: Options) => {
  md.renderer.rules.code_block = renderCode(
    md.renderer.rules.code_block,
    options
  )
  md.renderer.rules.fence = renderCode(md.renderer.rules.fence, options)
}
