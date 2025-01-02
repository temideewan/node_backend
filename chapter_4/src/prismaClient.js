import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient({
  omit: {
    todo: {
      deleted: true,
    }
  }
});

export default prisma;
