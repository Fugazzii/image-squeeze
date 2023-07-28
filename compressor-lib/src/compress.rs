pub fn compress(image_matrix: &mut Vec<Vec<i32>>, target_width: u32) {
    let height = image_matrix.len();
    let width = if height > 0 { image_matrix[0].len() } else { 0 };

    let target_ratio = target_width as f32 / width as f32;

    if target_ratio >= 1.0 {
        return;
    }

    let target_height = (height as f32 * target_ratio) as usize;
    let mut compressed_matrix = vec![vec![0; target_width as usize]; target_height];

    for y in 0..target_height {
        for x in 0..target_width {
            let src_x = ((x as f32) / target_ratio) as usize;
            let src_y = ((y as f32) / target_ratio) as usize;

            let mut sum = 0;
            let mut count = 0;
            for dx in 0..target_ratio.ceil() as usize {
                for dy in 0..target_ratio.ceil() as usize {
                    let x = src_x + dx;
                    let y = src_y + dy;
                    if x < width && y < height {
                        sum += image_matrix[y][x];
                        count += 1;
                    }
                }
            }

            let averaged_value = (sum as f32 / count as f32).round() as i32;
            compressed_matrix[y][x as usize] = averaged_value;
        }
    }

    *image_matrix = compressed_matrix;
}