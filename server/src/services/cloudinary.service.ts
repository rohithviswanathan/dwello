import { cloudinary } from "../lib/cloudinary";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

const PROPERTY_IMAGES_FOLDER = "dwello/properties";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export const uploadPropertyImage = (
  buffer: Buffer,
  propertyId: string,
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${PROPERTY_IMAGES_FOLDER}/${propertyId}`,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      },
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Cloudinary upload returned no result."));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );

    uploadStream.end(buffer);
  });
};

export const deletePropertyImage = async (
  publicId: string,
): Promise<boolean> => {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });

  return result.result === "ok";
};
