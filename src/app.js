import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    creadentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/warmup", (req, res) => {
    res.send("✨ API is running 🚀");
});

//Routes Import
import AuthRoutes from "./routes/auth.routes.js";
import IpoRoutes from "./routes/ipo.routes.js";
import MemberRoutes from "./routes/member.routes.js";
import ApplicationRoutes from "./routes/applications.routes.js";
import AdminRoutes from "./routes/admin.routes.js";
import FeedbackRoutes from "./routes/feedback.routes.js";

//Routes declaration
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/ipos", IpoRoutes);
app.use("/api/v1/member", MemberRoutes);
app.use("/api/v1/application", ApplicationRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/feedback", FeedbackRoutes);

app.use(errorHandler)

export { app };