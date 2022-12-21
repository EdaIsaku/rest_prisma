import * as dotenv from "dotenv";
dotenv.config();
const secret = process.env.SECRET_TOKEN || "RESTPRISMA2022";

import express from "express";
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

import user from "./router/user";
import news from "./router/news";
import { verifyToken } from "./utils/utils";

app.use("/api/user/", user);
app.use(
  "/api/news/",
  async (req, res, next) => {
    const bearer = req.headers.authorization;
    const token = bearer?.split(" ")[1];
    const isValid = await verifyToken(token);

    if (isValid) {
      next();
    } else {
      res.status(401).json({
        msg: "Your token has expired!",
      });
    }
  },
  news
);

app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`);
});
