import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  private saltRounds = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findUser(
    username: string,
  ): Promise<{ id: number; username: string; password: string } | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async checkValidUser(
    username: string,
    pass: string,
  ): Promise<{ id: number; username: string } | null> {
    const userRecord = await this.findUser(username);
    if (userRecord != null && bcrypt.compareSync(pass, userRecord.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = userRecord;
      return user;
    }
    return null;
  }

  async register(
    username: string,
    password: string,
  ): Promise<{ id: number; username: string }> {
    return this.prisma.user
      .create({
        data: {
          username: username,
          password: bcrypt.hashSync(password, this.saltRounds),
        },
      })
      .then(function (result) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...res } = result;
        return res;
      });
  }

  login(user: any): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user.userId,
    });
  }

  async deleteUser(username: string): Promise<void> {
    const user = await this.findUser(username);
    await this.prisma.user.delete({ where: user });
  }
}
