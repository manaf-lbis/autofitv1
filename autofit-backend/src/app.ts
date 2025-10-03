import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import userAuth from "./routes/user/authRoutes";
import adminAuth from "./routes/admin/authRoute";
import userRoute from "./routes/user/userRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import resetPassword from "./routes/common/resetPassword";
import mechanicAuth from './routes/mechanic/authRoutes'
import mechanicRoute from './routes/mechanic/mechanicRoutes'
import adminRoute from './routes/admin/adminRoute'
import chatRoute from './routes/common/chatRoutes'
import assetRoute from './routes/common/assetsRoute'
import notificationRoute from './routes/common/notificationRoute'
import httpLogger from "./utils/httpLogger";
import morgan from 'morgan'
import rateLimit from "express-rate-limit";


dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN!,
    credentials: true,
  })
);

app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 150, 
  message: "Too many requests, please try again later."
});

app.use(limiter);
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
      write: (message) => httpLogger.info(message.trim()),
    },
  })
);

app.use("/auth/:role/reset-password",resetPassword)
app.use("/auth/user", userAuth);
app.use("/auth/admin", adminAuth);
app.use("/auth/mechanic",mechanicAuth)


app.use("/user", userRoute);
app.use("/mechanic", mechanicRoute );
app.use("/admin",adminRoute)
app.use("/chat",chatRoute)
app.use("/assets",assetRoute)
app.use("/notifications",notificationRoute )

app.use(errorHandler);

export default app