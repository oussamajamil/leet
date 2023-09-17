import { Injectable } from '@nestjs/common';
    import { PrismaService } from 'src/prisma.service';
    import { CreateTestDto, UpdateTestDto } from './entities';
    
    @Injectable()
    export class TestService {
      constructor(private prisma: PrismaService) {}
    
    async findAll(options?: any) {
      const [totalResult, results] = await Promise.all([
        this.prisma.test.count({ where: options.where }),
          this.prisma.test.findMany(options),
        ]);
        return { totalResult, results };
    }
    
    async findOne(id: number, query?: any) {
      return await this.prisma.test.findUnique({ where:{ id},...query });
    }

    async create(data: CreateTestDto) {
      return await this.prisma.test.create({ data });
    }

    async update(id: number, data: UpdateTestDto) {
      return await this.prisma.test.update({ where: { id }, data });
    }
    
    async remove(id: number) {
      return await this.prisma.test.delete({ where: { id } });
    }
    
    async removeAll() {
      return await this.prisma.test.deleteMany({
        where: {},
      });
    }

    async addMany(data: CreateTestDto[]) {
      return await this.prisma.test.createMany({ data });
    }
  }
    