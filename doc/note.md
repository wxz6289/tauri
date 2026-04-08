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

首先将 JavaScript 项目编译为静态文件， 然后编译 Rust 项目并将这些静态文件打包进去。

Leptos

trunk 用于 Rust 的 WASM 网络应用程序打包工具


Tauri 不支持基于服务器的解决方案。它主要用于构建桌面应用程序，所有的前端资源都需要打包到应用程序中，不能依赖外部服务器来提供内容。这意味着应用程序在离线状态下也能正常运行，因为所有必要的资源都已经包含在应用程序包中。


架构
IPC
安全性
进程模型 多进程架构

核心进程的主要责任是利用该权限创建和协调应用程序窗口、系统托盘菜单或通知。负责进程间通信（IPC），以便不同进程能够安全地交换数据和命令。应负责管理全局状态和资源的分配，确保应用程序的稳定性和安全性。

WebView 进程  WebView 库不包含在你的最终可执行文件中，而是在运行时动态链接。需要考虑平台兼容性，确保在不同操作系统和硬件架构上都能正常运行。

- WebView2
- WKWebView
- webkitgtk

事件是一次性、单向的 IPC 消息，最适合用于通信生命周期事件和状态变化。与命令不同，事件可以由前端和 Tauri 核心发出。

命令Tauri 还提供了一种类似于外部函数接口的抽象，建立在IPC消息之上。主要 API invoke 类似于浏览器的fetch API，允许前端调用 Rust 函数、传递参数并接收数据。
命令在底层仍然使用消息传递，因此它们没有真实 FFI 接口所面临的安全隐患。


隔离模式的核心在于在前端和 Tauri Core 之间注入一个安全的应用程序，用于拦截和修改传入的 IPC 消息。