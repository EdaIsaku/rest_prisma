import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from "bcrypt";
const saltRounds = process.env.SALT_ROUNDS || 30;

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

export { checkIfExists, hashPassword };
