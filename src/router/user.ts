import express from "express";
const router = express.Router();
router.use(express.json());

import { PrismaClient } from "@prisma/client";
import { checkIfExists } from "../utils/utils";

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json({ AllUsers: allUsers });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: +id,
    },
  });
  res.json(user);
});

router.post("/create", async (req, res) => {
  const { id, email, password, name } = req.body;
  const isRegistered = await checkIfExists(email);
  if (isRegistered) {
    res.json({
      msg: "User with this email is already registerd",
    });
  } else {
    const newUser = await prisma.user.create({
      data: {
        id,
        email,
        name,
        password,
      },
    });
    res.send(newUser);
  }
});

router.post("/update", async (req, res) => {
  const { email, name } = req.body;
  const isRegistered = await checkIfExists(email);
  if (!isRegistered) {
    res.json({
      msg: "User with this email doesn't exists",
    });
  } else {
    const updatedUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        name,
      },
    });
    res.json(updatedUser);
  }
});

router.post("/delete", async (req, res) => {
  const { email } = req.body;
  const isRegistered = await checkIfExists(email);
  if (!isRegistered) {
    res.json({
      msg: "Can't delete: user with this email doesn't exists",
    });
  } else {
    const deletedUser = await prisma.user.delete({
      where: {
        email,
      },
    });
    res.json(deletedUser);
  }
});

export default router;
