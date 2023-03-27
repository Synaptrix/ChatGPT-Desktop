const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const { name, version } = require('../package.json')

const updateCargoVersion = () => {
  const tomlDir = resolve(__dirname, '../src-tauri/Cargo.toml')
  const lockDir = resolve(__dirname, '../src-tauri/Cargo.lock')

  for (const dir of [tomlDir, lockDir]) {
    let content = readFileSync(dir, 'utf-8')

    const reg = new RegExp(
      `name\\s*=\\s*"${name}"\\s*version\\s*=\\s*"\\d+.\\d+.\\d+"`
    )

    content = content.replace(reg, `name = "${name}"\nversion = "${version}"`)

    writeFileSync(dir, content)
  }
}

updateCargoVersion()
