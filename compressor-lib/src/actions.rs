use image::{DynamicImage, GenericImageView, ImageBuffer, Rgb, ImageOutputFormat};

pub fn matrix_to_image_bytes(image_matrix: &Vec<Vec<i32>>, format: ImageOutputFormat) -> Vec<u8> {
    let output = matrix_to_image(image_matrix);
    let mut buffer = Vec::new();
    output.write_to(&mut buffer, format).expect("Failed to write image to buffer");
    buffer
}

pub fn image_to_matrix(image: &DynamicImage) -> Vec<Vec<i32>> {
    let (width, height) = image.dimensions();
    let mut matrix = Vec::with_capacity(height as usize);

    for y in 0..height {
        let mut row = Vec::with_capacity(width as usize);
        for x in 0..width {
            let pixel = image.get_pixel(x, y);
            let pixel_value = ((pixel[0] as i32 + pixel[1] as i32 + pixel[2] as i32) / 3) as i32;
            row.push(pixel_value);
        }
        matrix.push(row);
    }

    matrix
}

pub fn matrix_to_image(matrix: &Vec<Vec<i32>>) -> DynamicImage {
    let height = matrix.len();
    let width = if height > 0 { matrix[0].len() } else { 0 };

    let mut image: ImageBuffer<Rgb<u8>, Vec<u8>> = ImageBuffer::new(width as u32, height as u32);

    for y in 0..height {
        for x in 0..width {
            let pixel_value = matrix[y][x] as u8; // <-- Corrected the indexing
            let pixel = Rgb([pixel_value, pixel_value, pixel_value]);
            image.put_pixel(x as u32, y as u32, pixel); // <-- Corrected the coordinates
        }
    }

    DynamicImage::ImageRgb8(image)
}


