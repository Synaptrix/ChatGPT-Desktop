<div align=center>
  <a href='https://github.com/bilibili-ayang/ChatGPT-Desktop'>
    <img height=100 src='./src-tauri/assets/icon.png' alt='icon' />
  </a>

  <h1>ChatGPT-Desktop</h1>

  <h3>基于 tauri + vue3 开发的跨平台桌面端应用</h3>

  <div>
    <a href="https://github.com/bilibili-ayang/ChatGPT-Desktop/releases">
      <img alt="macOS" src="https://img.shields.io/badge/-macOS-black?style=flat-square&logo=apple&logoColor=white" />
    </a>
    <a href="https://github.com/bilibili-ayang/ChatGPT-Desktop/releases">
      <img alt="Windows" src="https://img.shields.io/badge/-Windows-blue?style=flat-square&logo=windows&logoColor=white" />
    </a>
    <a href="https://github.com/bilibili-ayang/ChatGPT-Desktop/releases">
      <img alt="Linux" src="https://img.shields.io/badge/-Linux-yellow?style=flat-square&logo=linux&logoColor=white" />
    </a>
  </div>

  <div>
    <img src="https://img.shields.io/github/license/bilibili-ayang/ChatGPT-Desktop?style=flat-square" />
    <img src="https://img.shields.io/github/package-json/v/bilibili-ayang/ChatGPT-Desktop?style=flat-square" />
    <img src="https://img.shields.io/github/downloads/bilibili-ayang/ChatGPT-Desktop/total?style=flat-square" />
  </div>
</div>

## 为什么选择 ChatGPT-Desktop？

当今社会，智能化、便捷化已经成为趋势。选择 ChatGPT-Desktop，您将享受到以下优势：

- 我们使用 tauri 构建项目，使项目包更加小巧精简，资源占用更少，同时适配多个平台。

  这意味着您可以在不同的操作系统上都能够使用 ChatGPT-Desktop，并且不会感到卡顿。

- 可以选择让 app 常驻后台，快捷键(支持自定义)一键唤醒，问答快人一步。

  这一特性让您可以快速地使用 ChatGPT-Desktop，节省时间，提高效率。

- 支持多 session 对话，允许自定义更换对话角色，利用 GPT-3.5-turbo 的最新特性。

  这意味着您可以同时进行多个会话，并且可以自定义对话角色，使得对话更加灵活丰富。

- 更便捷的管理和调试 prompt，构建你自己的角色预设库。

  这一特性让您可以更好地管理和调试 ChatGPT-Desktop，同时还可以构建您自己的角色预设库，使得对话更加个性化。

- 将所有对话存储到本地，方便随时查阅！

  您可以随时查看以前的对话内容，方便您更好地了解自己的需求和 ChatGPT-Desktop 的表现。

- 更多的好玩的功能，有待与你一起探索...

## 下载

[下载链接](https://github.com/bilibili-ayang/ChatGPT-Desktop/releases)

支持的平台与架构：

- **Mac**: Apple Silicon, Intel
- **Windows**: Windows 7 - Windows 11
- **Linux**: x64

<img src='./images/home.png' />
<img src='./images/settings.png' />
<img src='./images/role-1.png' />
<img src='./images/session-1.png' />
<img src='./images/session-2.png' />
<img src='./images/history.png' />

## 常见问题：

<img width='300' src='./images/problem-1.png' />

如何解决：参考 huazai 大佬的[解决办法](https://zhuanlan.zhihu.com/p/135948430)

## 如何贡献

### 项目依赖

- [Rust 环境](https://tauri.app/v1/guides/getting-started/prerequisites/): 请自行根据官网步骤安装 rust 环境
- [Node.js](https://nodejs.org/en/): 用于运行项目

#### 下载依赖

```shell
npm install
```

#### 启动应用

```shell
npm run tauri dev
```

#### 打包应用

##### 如果需要打包后进行调试，请在以下命令后面加上 `--debug`

```shell
npm run tauri build
```

#### 生成应用图标，请自行替换`src-tauri/assets/icon.png` 文件，仅支持 `png` 格式

```shell
npm run build:icon
```

#### 也可以使用 `yarn` 或者 `pnpm` 等等...

欢迎任何形式的贡献，包括但不限于：

- 提交 issue
- 提交 pull request
- 提交 feature request
- 提交 bug report
- 提交文档校订
- 提交其他任何形式的贡献

#### Contributors

<a href="https://github.com/bilibili-ayang/ChatGPT-Desktop/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=bilibili-ayang/ChatGPT-Desktop" />
</a>
