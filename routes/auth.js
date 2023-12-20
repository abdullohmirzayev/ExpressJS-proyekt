import { Router } from "express";
import User from "../models/user.js";
import bcrytp from "bcrypt";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login | Abu",
    isLogin: true,
  });
});

router.get("/register", (req, res) => {
  res.render("register", {
    title: "Register | Abu",
    isRegister: true,
  });
});

router.post("/login", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

router.post("/register", async (req, res) => {
  const hashedPassword = await bcrytp.hash(req.body.password, 10)
  const userData = {
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    password: hashedPassword,
  };
  const user = await User.create(userData);
  res.redirect("/");
});

export default router;
