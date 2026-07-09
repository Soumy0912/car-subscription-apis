import razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export default razorpayInstance;