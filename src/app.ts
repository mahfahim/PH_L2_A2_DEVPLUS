import CookieParser from "cookie-parser";
import cors from "cors";
import express, {type Application, type Request, type Response}  from "express";
import { authRoute } from "./modules/auth/auth.route";


const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);

app.get("/",(req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "DevPulse API is running",
    });
});

export default app;