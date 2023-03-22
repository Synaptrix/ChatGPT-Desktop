// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;
use window_shadows::set_shadow;

mod tray;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            #[cfg(target_os = "macos")]
            _app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            #[cfg(any(windows, target_os = "macos"))]
            let window = _app.get_window("main").unwrap();
            set_shadow(&window, true).expect("Unsupported platform!");

            Ok(())
        })
        .system_tray(tray::main_menu())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .on_system_tray_event(tray::handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
