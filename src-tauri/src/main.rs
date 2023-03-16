// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_autostart::MacosLauncher;

mod folder;
mod tray;

fn main() {
    folder::create_folder();

    tauri::Builder::default()
        .setup(|app| {
            // Make the docker NOT to have an active app when started
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);
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
