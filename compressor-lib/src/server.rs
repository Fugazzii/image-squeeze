use actix_web::{App, Error, HttpResponse, HttpServer, error, Responder};
use actix_web::web::{Bytes, Data};
use image::io::Reader as ImageReader;
use image::ImageFormat;
use std::io::Cursor;

async fn compress_image(data: Data<Bytes>) -> Result<HttpResponse, Error> {

    println!("Compressing...");

    let image_bytes: Vec<u8> = data.to_vec();

    let image = ImageReader::new(Cursor::new(image_bytes))
        .with_guessed_format()
        .map_err(|err| error::ErrorInternalServerError(format!("Failed to guess image format: {:?}", err)))?
        .decode()
        .map_err(|err| error::ErrorInternalServerError(format!("Failed to decode image: {:?}", err)))?;

    let mut compressed_image = Vec::new();

    image.write_to(&mut compressed_image, ImageFormat::Png)
        .map_err(|err| error::ErrorInternalServerError(format!("Failed to write compressed image: {:?}", err)))?;

    Ok(HttpResponse::Ok()
        .content_type("image/png")
        .body(compressed_image))
}

async fn ping() -> impl Responder {
    HttpResponse::Ok()
        .content_type("text/plain")
        .body("Pong")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let server = HttpServer::new(|| App::new()
        .wrap(
            Cors::default()
                .allow_any_header()
                .allow_any_method()
                .allow_any_origin()
        )
        .route("/compress-image", actix_web::web::post().to(compress_image))
        .route("/ping", actix_web::web::get().to(ping))
    )
    .bind("127.0.0.1:8080")?;
    
    println!("Server is running");

    server.run().await
}
