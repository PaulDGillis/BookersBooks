import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async find(username: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { username: username },
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async deleteUser(username: string): Promise<User> {
    const user = await this.find(username);
    return this.prisma.user.delete({ where: user });
  }
}
