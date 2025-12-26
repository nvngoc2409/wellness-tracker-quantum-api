import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';

import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import albumRoutes from "./routes/album.routes.js";
import insightRoutes from "./routes/insight.routes.js";
import userRoutes from "./routes/user.routes.js";
import wellnessRoutes from "./routes/wellness.routes.js";
import webRoutes from "./routes/web.routes.js";

import expressLayouts from 'express-ejs-layouts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/legal');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err.message));

app.use("/", webRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/user", userRoutes);
app.use("/api/wellness", wellnessRoutes);
app.use("/api/insight", insightRoutes);

export default app;
