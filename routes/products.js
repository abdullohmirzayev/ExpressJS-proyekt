import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Boom shop | Abu",
  });
});

router.get("/products", (req, res) => {
  res.render("products", {
    title: "Products | Abu",
    isProducts: true,
  });
});

router.get("/add", (req, res) => {
  res.render("add", {
    title: "Add products | Abu",
    isAdd: true,
  });
});

export default router;
