import Subscriptions from "../models/subscription/subscription.js";
import express from "express";
import cron from "node-cron";
import Cars from "../models/car/car.js";
cron.schedule("0 0 * * *",async(req,res)=>{
    console.log("Working cron");
    const date = new Date();
    date.setUTCHours(0,0,0,0);
    console.log("date=============",date);
    await Subscriptions.updateMany( { endDate: date }, { status: "expired" } );
    const subscription = await Subscriptions.find(
        {endDate:date}
    );
    const carIds = subscription.map(sub => sub.carId);
    const car = await Cars.find({
        _id: { $in: carIds }
    });
    console.log("subscription=========",subscription);
    await Cars.updateMany(
        { _id: { $in: car.map(sub => sub._id) } },
        {availability_status:"available"}
    );
})
