import express from "express";
import multer from "multer";
import { addCar,editCar,reviewsubscription,allCarinfo,allsubscription } from "../../controllers/admin/car.js";
import {authenticateToken,isAdmin} from "../../middlewares/authmiddleware.js";
import { allUserinfo } from "../../controllers/admin/allUserinfo.js";
import uploadMedia from "../../middlewares/uploadimage.js";
import { uploadBufferToCloudinary } from "../../utils/cloudinary.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 

const router = express.Router();

router.post('/addCar',authenticateToken,isAdmin,upload.single("carImage"),addCar);  
router.put('/editCar/:id',authenticateToken,isAdmin,editCar);
router.get('/allCars',authenticateToken,isAdmin,allCarinfo);
router.post('/reviewsubscription/:id',authenticateToken,isAdmin,reviewsubscription);
router.get('/allsubscription',authenticateToken,isAdmin,allsubscription);

export default router;