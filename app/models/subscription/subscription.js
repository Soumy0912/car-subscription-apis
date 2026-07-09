import mongoose from "mongoose";

const subscriptiondetail = new mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true
    },
    carname:{
        type:String,
        required:true
    },
    carRegistrationnumber:{
        type:String,
        required:true
    },
    monthlyprice:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    username:{
        type:String,
        required:true
    },
    userphone:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    addredss:{
        type:String,
        required:true
    },
    total_price:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:['approve','rejected','pending','expired'],
        default:'pending'
    },
     razorpayOrderId: String,
    razorpayPaymentId: String,

    paymentStatus: {
        type: String,
        enum: ['pending','paid','failed'],
        default: 'pending'
    }
});

const Subscriptions = mongoose.model("Subscription",subscriptiondetail,"Subscriptions");

export default Subscriptions;