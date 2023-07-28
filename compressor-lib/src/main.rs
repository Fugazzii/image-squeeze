pub mod compress;
pub mod actions;
use std::{env, fs};
use image::ImageOutputFormat;

fn main() {
    let args: Vec<String> = env::args().collect();

    let file_path = &args[1];
    let quality: u32 = match args[2].parse() {
        Ok(q) => q,
        Err(_) => {
            println!("Invalid value.");
            return;
        }
    };

    match fs::read(file_path) {
        Ok(bytes) => {
            let dynamic_image = image::load_from_memory(&bytes)
                .expect("Failed to load the image.");

            let mut image_matrix = actions::image_to_matrix(&dynamic_image);

            println!("Compressing...");

            compress::compress(&mut image_matrix, quality);
            let compressed_image_data = actions::matrix_to_image_bytes(&image_matrix, ImageOutputFormat::Png);

            let save_path = "./uploads/".to_string() + &quality.to_string() + "_" + &file_path[10..];
            println!("{}", save_path);
            fs::write(&save_path, &compressed_image_data).expect("Failed to save compressed image.");

            println!("Image has been successfully compressed and saved to: {}", save_path);
        }
        Err(e) => {
            eprintln!("Error reading the file: {:?}", e);
        }
    }
}
