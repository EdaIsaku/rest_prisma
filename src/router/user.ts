import express from "express";
const router = express.Router();
router.use(express.json());

import { PrismaClient } from "@prisma/client";

import {
  checkIfExists,
  hashPassword,
  checkPassword,
  generateToken,
  verifyToken,
  startJob,
} from "../utils/utils";

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

router.post("/signUp", async (req, res) => {
  let { id, email, password, name } = req.body;
  startJob("sendEmail");
  startJob("test");

  const isRegistered = await checkIfExists(email);
  if (isRegistered) {
    res.json({
      msg: "User with this email is already registerd!",
    });
  } else {
    password = hashPassword(password);
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

router.post("/signIn", async (req, res) => {
  const { email, password } = req.body;
  const user = await checkIfExists(email);
  if (!user) {
    res.json({
      msg: "User isn't registered. Please Sign Up",
    });
  } else {
    const isPasswordCorrect = checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      res.json({
        msg: "Incorrect Password",
      });
    } else {
      const token = generateToken(email);
      res.send({ token: token });
    }
  }
});

export default router;
