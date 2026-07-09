import express from 'express';
import dotenv from "dotenv";
import routes from "./app/routes/index.js";
import connect from "./app/config/dbConfig.js";
import mediaRoutes from "./app/routes/media.js"
import cors from "cors";
import "./app/cron/subscription.js";
import razorpayInstance from './app/config/razor.js';
import cloudinary from './app/config/cloudinary.js';
dotenv.config();
const app = express();
app.use(cors({                        
  origin: ["http://localhost:5173","http://192.168.51.30:5173"],
  credentials: true,
}));
app.use(express.json());

const port=process.env.PORT;
const host=process.env.HOST
routes(app);
mediaRoutes(app);
connect();

app.get("/",(req,res)=>{
    res.send("Car Subscription apis.")
})

// app.listen(3000);
app.listen(process.env.PORT);
app.listen(port,host, ()=>{
    console.log(`Server is running on http://${host}:${port}`)
})
