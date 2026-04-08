use tauri::{ Emitter, ipc::Response, Listener };

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn read_file() -> Result<Response, String> {
    match std::fs::read("./test.txt") {
        Ok(data) => Ok(Response::new(data)),
        Err(e) => Err(format!("failed to read test.txt: {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder
        ::default()
        .setup(|app| {
            let app_handle = app.handle().clone();
            let _listener = app_handle.listen("custom-event", move |event: tauri::Event| {
                if let Some(payload) = event.payload() {
                    println!("received custom-event payload: {}", payload);
                } else {
                    println!("received custom-event with no payload");
                }
            });

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
        .invoke_handler(tauri::generate_handler![greet, read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
