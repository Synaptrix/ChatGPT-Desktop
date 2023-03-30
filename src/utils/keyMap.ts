// 热键
export const hotkeys = [
  {
    key: 'Shift',
    symbol: '⇧'
  },
  {
    key: 'Alt',
    symbol: '⌥'
  },
  {
    key: 'Control',
    symbol: '⌃'
  },
  {
    key: 'Command',
    symbol: '⌘'
  }
]

// 特殊按键
export const specialKeys = [
  {
    code: 'Escape',
    symbol: '⎋'
  },
  {
    code: 'Tab',
    symbol: '⇥'
  },
  {
    code: 'Backspace',
    symbol: '⌫'
  },
  {
    code: 'Enter',
    symbol: '↩︎'
  },
  {
    code: 'ArrowUp',
    symbol: '↑'
  },
  {
    code: 'ArrowRight',
    symbol: '→'
  },
  {
    code: 'ArrowDown',
    symbol: '↓'
  },
  {
    code: 'ArrowLeft',
    symbol: '←'
  }
]

// 普通按键
export const generalKeys = [
  // 1st row
  {
    code: 'F1'
  },
  {
    code: 'F2'
  },
  {
    code: 'F3'
  },
  {
    code: 'F4'
  },
  {
    code: 'F5'
  },
  {
    code: 'F6'
  },
  {
    code: 'F7'
  },
  {
    code: 'F8'
  },
  {
    code: 'F9'
  },
  {
    code: 'F10'
  },
  {
    code: 'F11'
  },
  {
    code: 'F12'
  },

  // 2nd row
  {
    code: 'Backquote',
    symbol: '`'
  },
  {
    code: 'Digit1'
  },
  {
    code: 'Digit2'
  },
  {
    code: 'Digit3'
  },
  {
    code: 'Digit4'
  },
  {
    code: 'Digit5'
  },
  {
    code: 'Digit6'
  },
  {
    code: 'Digit7'
  },
  {
    code: 'Digit8'
  },
  {
    code: 'Digit9'
  },
  {
    code: 'Digit0'
  },
  {
    code: 'Minus',
    symbol: '-'
  },
  {
    code: 'Equal',
    symbol: '='
  },
  // 3rd row
  {
    code: 'KeyQ'
  },
  {
    code: 'KeyW'
  },
  {
    code: 'KeyE'
  },
  {
    code: 'KeyR'
  },
  {
    code: 'KeyT'
  },
  {
    code: 'KeyY'
  },
  {
    code: 'KeyU'
  },
  {
    code: 'KeyI'
  },
  {
    code: 'KeyO'
  },
  {
    code: 'KeyP'
  },
  {
    code: 'BracketLeft',
    symbol: '['
  },
  {
    code: 'BracketRight',
    symbol: ']'
  },
  {
    code: 'Backslash',
    symbol: '\\'
  },

  // 4th row
  {
    code: 'KeyA'
  },
  {
    code: 'KeyS'
  },
  {
    code: 'KeyD'
  },
  {
    code: 'KeyF'
  },
  {
    code: 'KeyG'
  },
  {
    code: 'KeyH'
  },
  {
    code: 'KeyJ'
  },
  {
    code: 'KeyK'
  },
  {
    code: 'KeyL'
  },
  {
    code: 'Semicolon',
    symbol: ';'
  },
  {
    code: 'Quote',
    symbol: "'"
  },

  // 5th row
  {
    code: 'KeyZ'
  },
  {
    code: 'KeyX'
  },
  {
    code: 'KeyC'
  },
  {
    code: 'KeyV'
  },
  {
    code: 'KeyB'
  },
  {
    code: 'KeyN'
  },
  {
    code: 'KeyM'
  },
  {
    code: 'Comma',
    symbol: ','
  },
  {
    code: 'Period',
    symbol: '.'
  },
  {
    code: 'Slash',
    symbol: '/'
  },

  // 6th row
  {
    code: 'Space',
    symbol: 'Space'
  }
].map(({ code, symbol }) => ({
  code,
  symbol: symbol
    ? symbol
    : code.includes('Digit') || code.includes('Key')
    ? code[code.length - 1]
    : code.toUpperCase()
}))

/**
 * 判断是否为热键
 * @param key 按键 key 值
 */
export const isHotKey = (key: string) => {
  return hotkeys.some((item) => item.key === key)
}

/**
 * 判断是否为特殊键
 * @param key 按键 code 值
 */
export const isSpecialKey = (code: string) => {
  return specialKeys.some((item) => item.code === code)
}

/**
 * 获取按键符号
 * @param key 按键 code 值
 */
export const getKeySymbol = (code: string) => {
  const keys = [...specialKeys, ...generalKeys]

  return keys.find((item) => item.code === code)?.symbol
}
