import mongoose from "mongoose";import logger from "../utils/logger";
;

export const connectDB = async ()=>{
    try {
        const MONGODB_URI = process.env.MONGODB_URI 
       await mongoose.connect(MONGODB_URI as string)
       console.log('Databse Connected successfully');
        
    } catch (error) {
        logger.error('Database connection failed',error);
        console.log(error);
        process.exit(1) 
    }
     
}




