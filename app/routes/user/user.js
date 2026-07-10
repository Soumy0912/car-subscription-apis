import express from "express";
import {registerUser,loginUser,updateUser,getUser} from "../../controllers/auth.js";
import { getCars ,razorpayWebhook,subscription} from "../../controllers/user/car.js";
import { authenticateToken,isAdmin } from "../../middlewares/authmiddleware.js";
import { allUserinfo } from "../../controllers/admin/allUserinfo.js";

const router = express.Router();

router.post('/registerUser',registerUser);
router.post('/loginUser',loginUser);
router.put('/updateUser',authenticateToken,updateUser);
router.get('/getCars',getCars);
router.get('/allUser',authenticateToken,isAdmin,allUserinfo);
router.post('/Subscription',authenticateToken,subscription);
router.post('/subscription/verify-payment',razorpayWebhook);
router.get('/getUser',authenticateToken,getUser);


export default router;