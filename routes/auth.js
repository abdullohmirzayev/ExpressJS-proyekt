import { Router } from "express";
import User from "../models/user.js";
import bcrytp from "bcrypt";
import { genereteJWTToken } from "../services/token.js";

const router = Router();

router.get("/login", (req, res) => {
  if (req.cookies.token) {
    res.redirect("/");
    return;
  }
  res.render("login", {
    title: "Login | Abu",
    isLogin: true,
    loginError: req.flash("loginError"  ),
  });
});

router.get("/register", (req, res) => {
  if (req.cookies.token) {
    res.redirect("/");
    return;
  }
  res.render("register", {
    title: "Register | Abu",
    isRegister: true,
    redisterError: req.flash("redisterError"),
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
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

  const token = genereteJWTToken(existUser._id);
  res.cookie("token", token, { httpOnly: true, secure: true });
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
    firstName: firstname,
    lastName: lastname,
    email: email,
    password: hashedPassword,
  };
  const user = await User.create(userData);
  const token = genereteJWTToken(user._id);
  res.cookie("token", token, { httpOnly: true, secure: true });
  res.redirect("/");
});

export default router;
