import express from "express";
import Cars from "../../models/car/car.js";
import { sendResponse} from "../../utils/handleresponse.js";
import { getpagination } from "../../utils/pagination.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import carvalid from "../../validators/carvalidation.js";
import Subscriptions from "../../models/subscription/subscription.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import cloudinary from "../../config/cloudinary.js";
import { uploadBufferToCloudinary } from "../../utils/cloudinary.js";

dotenv.config();

export const addCar = async (req,res) => {
    try {
        const { error } = carvalid.validate(req.body);
        if (error) {
            return sendResponse(res,400,null,error.details[0].message);
        }
        const {carname,brand,monthlyprice,model,registration_number,availability_status} = req.body;
        const car = await Cars.findOne({ registration_number });
        if (car) {
            return sendResponse(res,400,null,"With this registration number car already exist");
        }
        if (!req.file || !req.file.buffer) {
            return sendResponse(res, 400, null, "Please upload a car image");
        }

        // 2. Call your custom stream helper function directly using the memory buffer
        console.log("🚀 Uploading image memory buffer straight to Cloudinary...");
        const cloudinarySecureUrl = await uploadBufferToCloudinary(req.file.buffer);

        // 3. Verify the helper function successfully returned a valid link string
        if (!cloudinarySecureUrl) {
            return sendResponse(res, 500, null, "Cloudinary upload failed.");
        }
        const cars = await Cars.create({
            carname,
            brand,
            model,
            carImage:cloudinarySecureUrl,
            monthlyprice,
            registration_number,
            availability_status
        });
        return sendResponse(res,201,cars);
    } catch (error) {
        return sendResponse(res,500,null,error.message);
    }
};

export const editCar = async (req,res) => {
    try {
        const { id } = req.params;
        const { carname,brand,model,monthlyprice,availability_status } = req.body;
        const updatedCar = await Cars.findByIdAndUpdate(
            id,
            {
                carname,
                brand,
                model,
                monthlyprice,
                availability_status
            },
            {
                new: true,
                runValidators: true,
            }
        );
        if (!updatedCar) {
            return sendResponse(res,404,null,"User not found!!");
        }
        return sendResponse(res,201,updatedCar,"Car updated successfully");
    } catch (error) {

        return sendResponse(res,500,null,error.message);
    }
};

export const allCarinfo = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;
        const totalCars = await Cars.countDocuments();
        const pagination = getpagination(totalCars,page,limit);
        const car = await Cars.find()
            .skip(skipIndex)
            .limit(limit);
        return sendResponse(res,200,{car,pagination},"hello");
    } catch (error) {
        return sendResponse(res,500,null,error.message);
    }
};

export const reviewsubscription = async (req,res) => {
    try {
        const subscriptionid = req.params.id;
        const {action} = req.body;

        if (!['approve', 'rejected'].includes(action)) {
            return sendResponse(res,400,null,"Invalid action. Use 'approve' or 'rejected'");
        }
        const subRequest = await Subscriptions.findById(subscriptionid);
        if (subRequest.status !== 'pending') {
            return sendResponse(res,400,null,`This request has already been ${subRequest.status}`);
        }
        if (action === 'approve') {
            subRequest.status = 'approve';
            await subRequest.save();
            await Cars.findByIdAndUpdate(subRequest.carId, {
                $set: { availability_status: "unavailable" }
            });
            const transporter = nodemailer.createTransport({
                      service: 'gmail', 
                      auth: {
                          user: process.env.EMAIL_USER, 
                          pass: process.env.EMAIL_PASS  
                      }
                  });
            
            const mailOptions = {
                      from: `"Car Rental Support" <${process.env.EMAIL_USER}>`,
                      to: user.email, 
                      subject: 'Subscription Approved Successfully'
            };
            await transporter.sendMail(mailOptions);
            return sendResponse(res,200,subRequest,"Subscription approved successfully. Car status updated to unavailable.");
        } 

        if (action === 'rejected') {
            subRequest.status = 'rejected';
            await subRequest.save();
            const transporter = nodemailer.createTransport({
                      service: 'gmail', 
                      auth: {
                          user: process.env.EMAIL_USER, 
                          pass: process.env.EMAIL_PASS  
                      }
            });
            
            const mailOptions = {
                      from: `"Car Rental Support" <${process.env.EMAIL_USER}>`,
                      to: user.email, 
                      subject: 'Subscription Rejected'
            };
            await transporter.sendMail(mailOptions);
            return sendResponse(res,200,subRequest,"Subscription request rejected. Car remains available.");
        }
        
    } catch (error) {
        return sendResponse(res,500,null,error.message);
    }
    
};

export const allsubscription = async (req,res) =>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;
        const totalsubscription = await Subscriptions.countDocuments();
        const pagination = getpagination(totalsubscription,page,limit);
        const subscription = await Subscriptions.find()
            .skip(skipIndex)
            .limit(limit);
        return sendResponse(res,200,{subscription,pagination},"hello");
    } catch (error) {
        return sendResponse(res,500,null,error.message);
    }
};