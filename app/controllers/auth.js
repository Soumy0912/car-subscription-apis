import User from "../models/user/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import uservalid from "../validators/uservalidation.js";
import Cars from "../models/car/car.js";
import {sendResponse} from "../utils/handleresponse.js";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req,res) => {
    try {
        const { error } = uservalid.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
        const {role,name,email,password,phone,address} = req.body;
        const user1 = await User.findOne({ email });
        if (user1) {
            return sendResponse(res,400,null,"User with this email already exists");
            
        }
        const hashedPassword = await bcrypt.hash(password, 10); 
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address
        });

        const dataWithoutpassword = user.toObject();
        delete dataWithoutpassword.password;
        delete dataWithoutpassword.__v;
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
                  subject: 'User Created Successfully'
              };
              await transporter.sendMail(mailOptions);
        return sendResponse(res,201,dataWithoutpassword);
    
    } catch (error) {
        return sendResponse(res,500,null,error.message);
    }
    
};

export const loginUser = async (req,res) => {
    try {
        const { email,password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return sendResponse(res,400,null,"password is wrong");
        }
   
        const payload ={
            role:user.role,
            id:user.id
        }
        const token = jwt.sign(payload,"hello");

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        delete userWithoutPassword.__v;
        return sendResponse(res,200,{token,userWithoutPassword},"User login Successful.")
    } catch (error) {
        return sendResponse(res,500,null,error.message);
    }
};

export const updateUser = async (req,res) => {
    try {
        const id = req.user.id;
        const { name, email,address,phone } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                email,
                address,
                phone
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedUser) {
            return sendResponse(res,400,null,"User not found");
        }

        const dataWithoutpassword = updatedUser.toObject();
        delete dataWithoutpassword.password;
        delete dataWithoutpassword.__v;
        return sendResponse(res,200,dataWithoutpassword,"Profile updated successfully");

    } catch (error) {
        return sendResponse(res,500,null,error.message);
    }
};


