# Tauri

不支持SSR
TAO负责窗口创建和管理, WRY负责网页渲染和交互。
WebView 是一个浏览器组件, 负责渲染网页内容。
不打包WebView,需要考虑平台兼容性

- tauri-runtime
- tauri-macros
- tauri-utils
- tauri-build
- tauri-codegen
- tauri-runtime-wry
- tao/winit
- wry

```sh
yarn create tauri-app

// or
yarn create vite .
yarn add -D @tauri-apps/cli
yarn tauri init
yarn tauri dev
```

IPC模式

- brownfield: 通过JS调用Rust命令
- isolate: 通过Rust调用JS命令

AES-GCM SubtleCrypto API

