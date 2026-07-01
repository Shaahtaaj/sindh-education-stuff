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

export function createCloudinaryUploadSignature(folder: string, deliveryType?: "private") {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary credentials are not configured.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params = deliveryType ? { folder, timestamp, type: deliveryType } : { folder, timestamp };
  return {
    timestamp,
    folder,
    signature: cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    ),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
  };
}

export function createPrivateDownloadUrl(publicId:string,format:string){
  if(!isCloudinaryConfigured())throw new Error("Cloudinary credentials are not configured.");
  return cloudinary.utils.private_download_url(publicId,format,{
    resource_type:"raw",type:"private",attachment:true,expires_at:Math.floor(Date.now()/1000)+5*60
  });
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
