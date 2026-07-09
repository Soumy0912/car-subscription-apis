import User from "../../models/user/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import uservalid from "../../validators/uservalidation.js";
import Cars from "../../models/car/car.js";
import {sendResponse} from "../../utils/handleresponse.js";
import mongoose from "mongoose";
import Subscriptions from "../../models/subscription/subscription.js";
import razorpayInstance from "../../config/razor.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const getCars = async (req, res) => {
    try {
        const { brand, model,search  } = req.query;

        const filter = { availability_status: 'available' };

        if (brand) {
            filter.brand = brand;
        }
        if (model) {
            filter.model = model;
        }
        if (search) {
            filter.$or = [
                { brand: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { carname: { $regex: search, $options: 'i' } }
            ];
        }

        const car = await Cars.find(filter);

        if (car.length === 0) {
            return sendResponse(res,200,null,"No car available at this time");
        }
        return sendResponse(res,200,car);

    } catch (error) {
        return sendResponse(res,500,null,error.message);

    }
};


export const subscription = async (req, res) => {
  try {
    const userid = req.user.id;
    const { carid, months, startdate, address } = req.body;

    const car = await Cars.findById(carid);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    console.log("car==============",car)

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const startDate = new Date(startdate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + Number(months));

    const m = Number(months);
    console.log("m================",m);
    
    const totalprice = m * Number(car.monthlyprice);
console.log("totalprice=================",totalprice)
       // Razorpay amount is in paise
        const options = {
            amount: totalprice * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

      const order = await razorpayInstance.orders.create(options);

      const newSubscription = new Subscriptions({
        carId: car._id,
        carname: car.carname,
        carRegistrationnumber: car.registration_number, 
        monthlyprice: String(car.monthlyprice),
        userId: user._id,
        username: user.name,
        userphone: user.phone, 
        startDate: startDate,
        endDate: endDate,
        addredss: address,
        total_price: String(totalprice),
        status: "pending",
          razorpayOrderId: order.id,

              paymentStatus: "pending",
      });
      await newSubscription.save();
    //   const transporter = nodemailer.createTransport({
    //       service: 'gmail', 
    //       auth: {
    //           user: process.env.EMAIL_USER, 
    //           pass: process.env.EMAIL_PASS  
    //       }
    //   });

    //   const mailOptions = {
    //       from: `"Car Rental Support" <${process.env.EMAIL_USER}>`,
    //       to: user.email, 
    //       subject: 'Subscription Created Successfully'
    //   };
    //   await transporter.sendMail(mailOptions);
      
    return sendResponse(res,200,newSubscription,"Subscription created successfully");

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const razorpayWebhook = async (req, res) => {
    try {

        const webhookSignature = req.headers["x-razorpay-signature"];

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(req.body) // raw body
            .digest("hex");

        if (expectedSignature !== webhookSignature) {
            return res.status(400).json({
                success: false,
                message: "Invalid webhook signature"
            });
        }

        const event = JSON.parse(req.body.toString());

        switch (event.event) {

            case "payment.captured": {

                const payment = event.payload.payment.entity;

                const orderId = payment.order_id;

                const paymentId = payment.id;

                await Subscriptions.findOneAndUpdate(
                    { razorpayOrderId: orderId },
                    {
                        paymentStatus: "paid",
                        // status: "approve",
                        razorpayPaymentId: paymentId
                    }
                );

                console.log("Payment Captured");

                break;
            }

            case "payment.failed": {

                const payment = event.payload.payment.entity;

                await Subscriptions.findOneAndUpdate(
                    { razorpayOrderId: payment.order_id },
                    {
                        paymentStatus: "failed",
                        status: "rejected"
                    }
                );

                console.log("Payment Failed");

                break;
            }

            default:
                console.log(`Unhandled event: ${event.event}`);
        }

        return res.status(200).json({
            success: true
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};