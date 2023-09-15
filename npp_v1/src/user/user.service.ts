import { Injectable } from '@nestjs/common';
    import { PrismaService } from 'src/prisma.service';
    import { CreateUserDto, UpdateUserDto } from './entities';
    
    @Injectable()
    export class UserService {
      constructor(private prisma: PrismaService) {}
    
    async findAll(options?: any) {
      const [totalResult, results] = await Promise.all([
        this.prisma.user.count({ where: options.where }),
          this.prisma.user.findMany(options),
        ]);
        return { totalResult, results };
    }
    
    async findOne(userId: number, query?: any) {
      return await this.prisma.user.findUnique({ where:{ userId},...query });
    }

    async create(data: CreateUserDto) {
      return await this.prisma.user.create({ data });
    }

    async update(userId: number, data: UpdateUserDto) {
      return await this.prisma.user.update({ where: { userId }, data });
    }
    
    async remove(userId: number) {
      return await this.prisma.user.delete({ where: { userId } });
    }
    
    async removeAll() {
      return await this.prisma.user.deleteMany({
        where: {},
      });
    }

    async addMany(data: CreateUserDto[]) {
      return await this.prisma.user.createMany({ data });
    }
  }
    