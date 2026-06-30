import cloudinary from "./cloudinary";

export async function uploadImage(file: File) {
  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "hotel-management",
        },
        (error, result) => {
          if (error) return reject(error);

          resolve(result!.secure_url);
        }
      )
      .end(buffer);
  });
}