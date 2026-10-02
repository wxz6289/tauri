use tauri::Emitter;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn farewell(name: &str) -> String {
    format!("Goodbye, {}! You've been farewelled from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder
        ::default()
        .setup(|app| {
            let app_handle = app.handle().clone();
            let _ = app.emit("tauri://ready", ());
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_secs(1));
                let _ = app_handle.emit(
                    "app-ready",
                    serde_json::json!({
                    "message": "Application fully initialized",
                    "timestamp": std::time::SystemTime::now()
                        .duration_since(std::time::UNIX_EPOCH)
                        .unwrap()
                        .as_secs()
                })
                );
            });
            Ok(())
        })
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![greet, farewell])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
