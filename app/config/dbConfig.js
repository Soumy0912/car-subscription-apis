import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

const connect = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo Connected");
    } catch (error) {
        console.log("Not Connected");
    }
}

export default connect;