import { Router } from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middieware/auth.js";
import userMiddleware from "../middieware/user.js";
import user from "../middieware/user.js";
const router = Router();

router.get("/", async (req, res) => {
  const products = await Product.find().lean();
  res.render("index", {
    title: "Boom shop | Abu",
    products: products,
  });
});

router.get("/products", (req, res) => {
  res.render("products", {
    title: "Products | Abu",
    isProducts: true,
  });
});

router.get("/add", authMiddleware, (req, res) => {
  res.render("add", {
    title: "Add products | Abu",
    isAdd: true,
    errorAddProducts: req.flash("errorAddProducts"),
  });
});

router.post("/add-products", userMiddleware, async (req, res) => {
  const { title, description, image, price } = req.body;

  if (!title || !description || !image || !price) {
    req.flash("errorAddProducts", "All fields is required");
    res.redirect("/add");
    return;
  }

  await Product.create({ ...req.body, user: req.userId });
  res.redirect("/");
});

export default router;
