// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;
#[cfg(target_os = "windows")]
use window_shadows::set_shadow;

mod commands;
mod tray;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            #[cfg(target_os = "macos")]
            _app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            #[cfg(target_os = "windows")]
            set_shadow(&_app.get_window("main").unwrap(), true).expect("Unsupported platform!");

            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = _app.get_window("main").unwrap();
                window.open_devtools();
            }

            Ok(())
        })
        .system_tray(tray::main_menu())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            let window = app.get_window("main").unwrap();
            window.show().unwrap();
            window.unminimize().unwrap();
            window.set_focus().unwrap();
        }))
        .invoke_handler(tauri::generate_handler![
            commands::show_in_folder,
            commands::close_splashscreen
        ])
        .on_system_tray_event(tray::handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
