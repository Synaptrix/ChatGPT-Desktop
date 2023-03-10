use std::env;
use std::fs;
use std::path::PathBuf;

pub fn create_folder() {
    let home_dir = env::var("HOME").expect("Failed to get home directory");

    let path = PathBuf::from(home_dir).join(if cfg!(target_os = "macos") {
        "Library/Application Support/ChatGPT"
    } else {
        "AppData/Roaming/ChatGPT"
    });

    fs::create_dir_all(path).expect("Failed to create directory");
}
