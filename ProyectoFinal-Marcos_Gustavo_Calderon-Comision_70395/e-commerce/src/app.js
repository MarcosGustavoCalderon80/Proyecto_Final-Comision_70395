import express from "express";
import { connectMongoDB } from "./config/mongoDB.config.js";
import cartsRouter from "./router/carts.router.js";
import productsRouter from "./router/products.router.js";

connectMongoDB();
const PORT = 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
