import mongoose from "mongoose";;

export const connectDB = async ()=>{
    try {
        const MONGODB_URI = process.env.MONGODB_URI 
       await mongoose.connect(MONGODB_URI as string)
       console.log('Databse Connected successfully');
        
    } catch (error) {
        console.log(error);
        process.exit(1) 
    }
     
}


