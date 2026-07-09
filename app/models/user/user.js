import mongoose from "mongoose";

const userdetails = new mongoose.Schema({
    role:{
        type:String,
        enum:['user','admin'],
        default:"user"
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    address:{
        type:String
    }
})

const User = mongoose.model("User",userdetails,"Users");

export default User;