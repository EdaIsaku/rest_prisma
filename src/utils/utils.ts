import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = process.env.SALT_ROUNDS || 30;
const secret = process.env.SECRET_TOKEN || "RESTPRISMA2022";

const salt = bcrypt.genSaltSync(+saltRounds);

const checkIfExists = async (email: string) => {
  const userExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return userExist;
};

const hashPassword = (password: string) => {
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

const checkPassword = (password: string, hashedPassword: string) => {
  const isCorrect = bcrypt.compareSync(password, hashedPassword);
  return isCorrect;
};

const generateToken = (email: string) => {
  if (secret !== undefined) {
    const token = jwt.sign({ email }, secret, { expiresIn: "100s" });
    return token;
  }
};

const verifyToken = (token: any) => {
  jwt.verify(token, secret, (err, decode) => {
    if (err?.name === "TokenExpiredError") {
      return false;
    } else {
      return true;
    }
  });
};

export {
  checkIfExists,
  hashPassword,
  checkPassword,
  generateToken,
  verifyToken,
};
