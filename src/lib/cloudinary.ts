import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "raw" | "auto" = "auto"
): Promise<UploadApiResponse> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary credentials are not configured.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const options: UploadApiOptions = {
    folder,
    resource_type: resourceType,
    use_filename: true,
    unique_filename: true,
    filename_override: file.name,
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error("Cloudinary upload failed."));
        return;
      }
      resolve(result);
    });

    stream.end(buffer);
  });
}
