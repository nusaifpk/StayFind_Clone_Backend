import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from "multer";
import fs from "fs";
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDirectory = path.resolve(__dirname, "upload");

const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage });

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const imageUpload = (req, res, next) => {
    upload.single("image")(req, res, async (error) => {
        if (error) {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "Property-images"
            });
            req.body.image = result.secure_url;
            fs.unlink(req.file.path, (unlink_error) => {
                if (unlink_error) {
                    console.log("Error deleting local files after uploading to cloudinary");
                }
            });
            next();
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "error",
                message: "Error uploading file to Cloudinary"
            });
        }
    });
};

export default imageUpload;
