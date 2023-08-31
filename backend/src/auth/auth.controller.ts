import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Username } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check/:username')
  async checkUsername(@Param('username') username: string): Promise<void> {
    const user = await this.authService.findUser(username);
    if (user !== null)
      throw new HttpException('Username taken', HttpStatus.FORBIDDEN);
  }

  @Post('register')
  async registerUser(
    @Body() userData: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    return this.authService
      .register(userData.username, userData.password)
      .then((user) => {
        const access_token = this.authService.login(user.username);
        res
          .cookie('access_token', access_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 10000),
          })
          .send();
      })
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
  @Post('login')
  async userLogin(
    @Username() username: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const access_token = this.authService.login(username);
    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 10000),
      })
      .send();
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    res.clearCookie('access_token').send();
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  getProfile() {}

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(
    @Username() username: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.deleteUser(username);
    res.clearCookie('access_token').send();
  }
}
