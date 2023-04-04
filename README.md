<a href="https://github.com/Synaptrix/ChatGPT-Desktop">
  <img src="https://socialify.git.ci/Synaptrix/ChatGPT-Desktop/image?description=1&descriptionEditable=Blazingly%20fast%20launcher%20for%20ChatGPT%20API%2C%20supercharged%20and%20productivity%20Chat%20Assistant&font=Inter&forks=1&logo=https%3A%2F%2Fraw.githubusercontent.com%2FSynaptrix%2FChatGPT-Desktop%2Fmaster%2Fsrc-tauri%2Fassets%2Ficon.png&name=1&owner=1&pattern=Circuit%20Board&stargazers=1&theme=Auto" alt="ChatGPT-Desktop"/>
</a>

<div align=center>
  <br/>
  <div>
      English | <a href="./README-CN.md">中文</a>
  </div>
  <br/>

  <div>
    <a href="https://github.com/Synaptrix/ChatGPT-Desktop/releases/latest">
      <img alt="macOS" src="https://img.shields.io/badge/-macOS-black?style=flat-square&logo=apple&logoColor=white" />
    </a>
    <a href="https://github.com/Synaptrix/ChatGPT-Desktop/releases/latest">
      <img alt="Windows" src="https://img.shields.io/badge/-Windows-blue?style=flat-square&logo=windows&logoColor=white" />
    </a>
    <a href="https://github.com/Synaptrix/ChatGPT-Desktop/releases/latest">
      <img alt="Linux" src="https://img.shields.io/badge/-Linux-yellow?style=flat-square&logo=linux&logoColor=white" />
    </a>
  </div>

  <div>
    <img src="https://img.shields.io/github/license/Synaptrix/ChatGPT-Desktop?style=flat-square" />
    <img src="https://img.shields.io/github/package-json/v/Synaptrix/ChatGPT-Desktop?style=flat-square" />
    <img src="https://img.shields.io/github/downloads/Synaptrix/ChatGPT-Desktop/total?style=flat-square" />
  </div>
</div>

## Features

- Support for multiple platforms, minimal resource usage, ideal for 24/7 use

- Easily configurable proxy settings, bypass network restrictions with ease

- Wake up at any time with a customizable shortcut key, boost your productivity

- Support for multiple conversations, integrated with `GPT-3.5-turbo` memory mode, never forget what you've said

- Robust prompt management, build your own role preset library

- Share your moments with just one click

- Automatic updates, local conversation history storage, your privacy is our priority

- And much more to explore...

## Download

Supported Platforms:

- **MacOS**: [Apple Silicon](https://github.com/ChatGPT-Desktop/ChatGPT-Desktop/releases/download/v1.0.1/ChatGPT-Desktop_1.0.1_aarch64.dmg) | [Intel](https://github.com/ChatGPT-Desktop/ChatGPT-Desktop/releases/download/v1.0.1/ChatGPT-Desktop_1.0.1_x64.dmg)
- **Windows**: [Windows](https://github.com/ChatGPT-Desktop/ChatGPT-Desktop/releases/download/v1.0.1/ChatGPT-Desktop_1.0.1_x64_zh-CN.msi)
- **Linux**: [Linux](https://github.com/ChatGPT-Desktop/ChatGPT-Desktop/releases/download/v1.0.1/chat-gpt-desktop_1.0.1_amd64.deb)

<img src='./images/theme.gif' width="100%" />

## Screenshots

<details>
<summary>Detail</summary>
<img src='./images/home.png' />
<img src='./images/settings.png' />
<img src='./images/role-1.png' />
<img src='./images/session-1.png' />
<img src='./images/session-2.png' />
<img src='./images/session-3.png' />
<img src='./images/history.png' />
<img src='./images/update.png' />
</details>

## Q & A

<details>
<summary>1. There are network restrictions in my area, how can I use it properly?</summary>

You can try our provided [soulution](https://github.com/ChatGPT-Desktop/ChatGPT-Desktop-Porxy).

Detailed deployment tutorial on [Discord](https://discord.com/channels/1074429768063262791/1090723974650015857).

</details>

<details>
<summary>2. "App Is Damaged and Can't Be Opened" on MacOS</summary>
<img width='300' src='./images/problem-1.png' />

Reference [solution](https://zhuanlan.zhihu.com/p/135948430).

</details>

## How to Contribute

#### Development environment requirements

Please install `Rust` & `NodeJS` according to the steps on the official websites

- [Rust](https://tauri.app/v1/guides/getting-started/prerequisites/)
- [Node.js](https://nodejs.org/en/)

#### Download project dependencies

```shell
npm install
```

#### Run the project on the development mode

```shell
npm run tauri dev
```

#### Build the project

Debug after build, please add flag `--debug`

```shell
npm run tauri build
```

#### To generate your own application icon, please replace `src-tauri/assets/icon.png`, only `.png` format is supported

```shell
npm run build:icon
```

`yarn` OR `pnpm` is also supported.

### Contributions of any kind are welcome,

- Issue
- Pull request
- Feature request
- Bug report
- Documentation
- Translation
- etc.

## Contact Us

- [Discord](https://discord.gg/jg4waryfA6)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Synaptrix/ChatGPT-Desktop&type=Date)](https://star-history.com/#Synaptrix/ChatGPT-Desktop&Date)

## Contributors

<a href="https://github.com/Synaptrix/ChatGPT-Desktop/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Synaptrix/ChatGPT-Desktop" />
</a>

## License

[MIT License](./LICENSE)
