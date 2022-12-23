import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { bree } from "../index";
import { workerData } from "worker_threads";

const saltRounds = process.env.SALT_ROUNDS || 30;
const secret = process.env.SECRET_TOKEN;

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
    const token = jwt.sign({ email }, secret, { expiresIn: "1000s" });
    return token;
  }
};

const verifyToken = (token: any): any => {
  if (secret !== undefined) {
    let result = jwt.verify(token, secret, (err: any, decode: any) => {
      if (decode) {
        return decode;
      } else {
        return false;
      }
    });
    return result;
  }
};

const resetJob = async (jobName: string) => {
  console.log("reseted");
  await bree.remove(jobName);
};

const startJob = async (jobName: string) => {
  await bree.start(jobName);
  const workers = await workerData;
  console.log(workers);

  // const jobExists = bree.config.jobs.filter((el) => {
  //   return el.name === jobName;
  // });

  // if (!(jobExists.length > 0)) {
  //   await resetJob(jobName);
  // } else {
  //   await bree.start(jobName);
  //   console.log("worker data", workerData);
  // }
};

export {
  checkIfExists,
  hashPassword,
  checkPassword,
  generateToken,
  verifyToken,
  startJob,
  resetJob,
};
