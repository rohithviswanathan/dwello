import { NextFunction, Request, Response } from "express";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const validatePropertyImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required.",
      });
    }

    // Import file-type dynamically to support its ESM package format.
    const { fileTypeFromBuffer } = await import("file-type");

    for (const file of files) {
      const detectedType = await fileTypeFromBuffer(file.buffer);

      if (!detectedType || !ALLOWED_IMAGE_TYPES.has(detectedType.mime)) {
        return res.status(400).json({
          success: false,
          message: "One or more files are not valid JPEG, PNG or WebP images.",
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
