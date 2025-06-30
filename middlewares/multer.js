import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "rci-backend-documents",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "pdf", "docx", "xlsx", "pptx", "txt", "zip"],
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
  }),
});

const upload = multer({ storage });

export default upload;