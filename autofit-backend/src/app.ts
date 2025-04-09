import express from 'express'
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoute from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler';


dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
  }));

app.use(express.json());
app.use(cookieParser())

connectDB();


app.use('/auth', authRoute);


app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`Server started Running on ${PORT}`))