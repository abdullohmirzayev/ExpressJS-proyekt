import express from "express";
import { create } from "express-handlebars";
import mongoose from "mongoose";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

import varMiddleware from "./middieware/var.js";
import userMiddleware from "./middieware/user.js";

// Routes
import AuthRoutes from "./routes/auth.js";
import ProductsRoutes from "./routes/products.js";
import hbsHelper from "./utils/index.js";

dotenv.config();

const app = express();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: hbsHelper,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({ secret: "Abdulloh", resave: false, saveUninitialized: false })
);
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use(AuthRoutes);
app.use(ProductsRoutes);

const startApp = () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
      })
      .then(() => {
        console.log("Connected to MongoDB successfully!");
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
      });

    const PORT = process.env.PORT || 4100;
    app.listen(PORT, () => console.log(`Server is running on POST: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
startApp();
