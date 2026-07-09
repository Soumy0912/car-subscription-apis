import mongoose from "mongoose";

const cardetails = new mongoose.Schema({
    carname:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    model:{
        type:String,
        required:true
    },
    monthlyprice:{
        type:String,
        required:true
    },
    carImage:{
        type:String
    },
    registration_number:{
        type:String,
        required:true
    },
    availability_status:{
        type:String,
        required:true,
        enum:['available','unavailable'],
        default:'available'
    }
});

const Cars = mongoose.model("Car",cardetails,"Cars");

export default Cars;