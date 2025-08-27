import "dotenv/config";

import express from "express";
import morgan from "morgan";
import cors from "cors";

import connectMongoDB from "./src/config/mongodbConfig.js";
import router from "./src/routes/authRoutes.js";
import categoryRouter from "./src/routes/categoryRoutes.js";
import productRouter from "./src/routes/productRoutes.js";
import orderRouter from "./src/routes/orderRoutes.js";
import reviewRouter from "./src/routes/reviewRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// static serve
app.use("/assets", express.static("assets"));

// routes
app.use("/api/admin/v1/auth", router);

// Category routes
app.use("/api/admin/v1/categories", categoryRouter);

//product routes

app.use("/api/admin/v1/products", productRouter);

//order router

app.use("/api/admin/v1/orders", orderRouter);

//user routes

app.use("/api/admin/v1/users", userRouter);

//review routes//
app.use("/api/admin/v1/reviews", reviewRouter);

// health check
app.get("/", (_, res) => res.json({ status: "OK", message: "Admin API" }));

//error handler//
app.use(errorHandler);

// boot
(async () => {
  await connectMongoDB();
  app.listen(PORT, () => console.log(`Admin backend running on port ${PORT}`));
})();
