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

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/auth/:role/reset-password",resetPassword)
app.use("/auth/user", userAuth);
app.use("/auth/admin", adminAuth);
app.use("/auth/mechanic",mechanicAuth)



app.use("/user", userRoute);


app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started Running on ${PORT}`));