import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
const PORT = process.env.PORT;

import user from "./router/user";

app.use("/api/user/", user);

app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`);
});
