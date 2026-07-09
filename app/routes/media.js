import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mediaRoutes = (app) => {
    app.get("/uploads/:folder/:fileName", (req, res) => {
        const { folder, fileName } = req.params;

        const filePath = path.join(
            __dirname,
            "../uploads",
            folder,
            fileName
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        res.sendFile(filePath);
    });
};

export default mediaRoutes;