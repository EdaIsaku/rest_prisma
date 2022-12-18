import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const checkIfExists = async (email: string) => {
  const userExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return userExist;
};

export { checkIfExists };
