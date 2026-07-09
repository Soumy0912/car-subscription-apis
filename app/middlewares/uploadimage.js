import path from "path";
import fs from "fs";
import sharp from "sharp";
import { fileURLToPath } from "url";
import {sendResponse} from "../utils/handleresponse.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadMedia = async (req, res, next) => {
    try {
        if (req.file) { 
            const profile = req.file; 
            const imageDir = path.join(__dirname, "../uploads/carImage");
            
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, { recursive: true });
            }
            
            const imageName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
            const imagePath = path.join(imageDir, imageName);
            
            await sharp(profile.buffer)
                .webp({ quality: 80 })
                .toFile(imagePath);
            req.carImagePath = `/uploads/carImage/${imageName}`;
            console.log("Image saved successfully:", imagePath);
        }
        next();

    } catch (error) {
        return sendResponse(res,500,null,error.message);
    }
};

export default uploadMedia;
