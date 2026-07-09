import express from "express";
import userRoutes from "./user/user.js"
import carRoutes from "./admin/car.js"

export default(app)=>{
    app.use("/api/v1/auth/user",userRoutes);
    app.use("/api/v1/auth/car",carRoutes);
}
