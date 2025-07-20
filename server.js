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

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// routes
app.use("/api/admin/v1/auth", router);

// Category routes
app.use("/api/admin/v1/categories", categoryRouter);

//product routes

app.use("/api/admin/v1/products", productRouter);

//order router

app.use("/api/admin/v1/orders", orderRouter);

//review routes//
app.use("/api/admin/v1/reviews", reviewRouter);

// health check
app.get("/", (_, res) => res.json({ status: "OK", message: "Admin API" }));

// boot
(async () => {
  await connectMongoDB();
  app.listen(PORT, () => console.log(`Admin backend running on port ${PORT}`));
})();
