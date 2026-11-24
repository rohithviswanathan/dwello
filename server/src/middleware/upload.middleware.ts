import multer from "multer";

class UploadValidationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
    this.statusCode = 400;
  }
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 10;

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new UploadValidationError("Only JPEG, PNG and WebP images are allowed."),
    );
  }

  callback(null, true);
};

export const uploadPropertyImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
}).array("images", MAX_FILES);
