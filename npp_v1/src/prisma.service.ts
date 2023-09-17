import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

async function hashPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function checkPassword(data: any) {
  if (typeof data === 'object') {
    for (const key in data) {
      if (key === 'password' && typeof data[key] === 'string') {
        data[key] = await hashPassword(data[key]);
      }
      if (typeof data[key] === 'object') {
        await checkPassword(data[key]);
      }
    }
  }
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    this.$use(async (params, next) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { action, args } = params;
      if (action == 'deleteMany') {
        if (Object.keys(params.args.where).length === 0)
          throw new Error('No data provided');
      }
      if (action == 'create' || action == 'update') {
        // prervent sending  empty Object in create and update
        if (Object.keys(params.args.data).length === 0)
          throw new Error('No data provided');
        // hash password
        await checkPassword(params.args.data);
      }

      return next(params);
    });
  }
  async onModuleDestroy() {
    // Disconnect Prisma Client
    await this.$disconnect();
  }
}
