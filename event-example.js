// 前端JavaScript代码示例，用于监听Tauri事件

import { listen } from '@tauri-apps/api/event'

// 监听tauri://ready事件
await listen('tauri://ready', (event) => {
  console.log('Tauri is ready!', event.payload)
  // 在这里执行应用初始化后的操作
})

// 监听自定义app-ready事件
await listen('app-ready', (event) => {
  console.log('App fully initialized:', event.payload)
  const { message, timestamp } = event.payload
  console.log(`Message: ${message}, Time: ${new Date(timestamp * 1000)}`)
})

// 也可以使用once来只监听一次
import { once } from '@tauri-apps/api/event'

await once('tauri://ready', (event) => {
  console.log('This will only be called once when Tauri is ready')
})
