export const useDisableShortcuts = () => {
  const disabledShortcuts = [
    'Control+p',
    'Control+f',
    'Control+g',
    'Control+r',
    'Control+u',
    'Control+l',
    'Control+Shift+g',
    'Control+Shift+i',
    'Control+Shift+p',
    'Control+Shift+r',
    'F3',
    'F7'
  ]

  const onKeydown = (event: KeyboardEvent) => {
    const { ctrlKey, shiftKey, key, code } = event

    const control = ctrlKey ? 'Control+' : ''
    const shift = shiftKey ? 'Shift+' : ''

    const shortcut = `${shift}${control}${key.toLowerCase()}`

    if (
      disabledShortcuts.includes(shortcut) ||
      disabledShortcuts.includes(code)
    ) {
      event.preventDefault()
    }
  }

  document.body.addEventListener('keydown', onKeydown)
}
