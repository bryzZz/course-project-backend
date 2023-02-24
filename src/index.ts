import express from "express";
import dotenv from "dotenv";

import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { notFound, errorHandler } from "./middlewares";
import router from "./router";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/v1", router);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
