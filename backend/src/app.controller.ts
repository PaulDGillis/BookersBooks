import {
  Request,
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Delete,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users/users.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('auth/signup')
  async signupUser(
    @Body() userData: { username: string; password: string },
  ): Promise<any> {
    return this.authService
      .signup(userData.username, userData.password)
      .catch((error: PrismaClientKnownRequestError) => {
        if (error.code === 'P2002') {
          throw new HttpException(
            'Username Taken',
            HttpStatus.EXPECTATION_FAILED,
          );
        }
      });
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async loginUser(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(req.user);
    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 10000),
      })
      .send({ status: 'ok' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token').send({ status: 'ok' });
  }

  @Post('auth/checkUsername')
  async checkUsername(@Body() body: { username: string }) {
    return this.userService.find(body.username).then((user: User) => {
      return { valid: user === null };
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user')
  async deleteUser(@Request() req) {
    return this.authService.deleteUser(req.user);
  }

  @Get('user/list')
  async listUser() {
    if (process.env.IS_DEV !== 'true') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return this.userService.list();
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/status')
  getProfile() {
    return { status: 'ok' };
  }
}
