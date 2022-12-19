import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
const secret = process.env.SECRET_TOKEN || "RESTPRISMA2022";

import express from "express";
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

import user from "./router/user";
import news from "./router/news";
import { verifyToken } from "./utils/utils";
import e from "express";

app.use("/api/user/", user);
app.use(
  "/api/news/",
  (req, res, next) => {
    const bearer = req.headers.authorization;
    const token = bearer?.split(" ")[1];

    if (typeof token === "string") {
      jwt.verify(token, secret, (err, decode) => {
        if (err) {
          res.status(401).json({
            msg: "Your token has expired!",
          });
        } else {
          next();
        }
      });
    }
  },
  news
);

app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`);
});
