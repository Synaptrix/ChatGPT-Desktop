// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;
use window_vibrancy::{NSVisualEffectMaterial, NSVisualEffectState};

#[cfg(target_os = "macos")]
use window_vibrancy::apply_vibrancy;

#[cfg(target_os = "windows")]
use window_vibrancy::apply_blur;

mod folder;
mod tray;

fn main() {
    folder::create_folder();

    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(
                &window,
                NSVisualEffectMaterial::HudWindow,
                Some(NSVisualEffectState::Active),
                None,
            )
            .expect("当前系统不支持磨砂效果");

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125))).expect("当前系统不支持磨砂效果");

            Ok(())
        })
        .system_tray(tray::main_menu())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .on_system_tray_event(tray::handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
