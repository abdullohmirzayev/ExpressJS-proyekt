import { Router } from "express";
import User from "../models/user.js";
import bcrytp from "bcrypt";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login | Abu",
    isLogin: true,
    loginError: req.flash("loginError"),
  });
});

router.get("/register", (req, res) => {
  res.render("register", {
    title: "Register | Abu",
    isRegister: true,
    redisterError: req.flash("redisterError"),
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash("loginError", "All fields is required");
    res.redirect("/login");
    return;
  }

  const existUser = await User.findOne({ email });
  if (!existUser) {
    req.flash("loginError", "User not found");
    res.redirect("/login");
    return;
  }

  const isPassEqul = await bcrytp.compare(password, existUser.password);
  if (!isPassEqul) {
    req.flash("loginError", "Password wrong");
    res.redirect("/login");
    return;
  }

  console.log(existUser);
  res.redirect("/");
});

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    req.flash("redisterError", "All fields is required");
    res.redirect("/register");
    return;
  }

  const candidate = await User.findOne({ email });

  if (candidate) {
    req.flash("redisterError", "User already exist");
    res.redirect("/register");
    return;
  }

  const hashedPassword = await bcrytp.hash(password, 10);
  const userData = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
  };
  const user = await User.create(userData);
  res.redirect("/");
});

export default router;
