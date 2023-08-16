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
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/signup')
  async signupUser(
    @Body() userData: { username: string; password: string },
  ): Promise<any> {
    return this.authService.signup(userData.username, userData.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async loginUser(@Request() req) {
    return this.authService.login(req.user);
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
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
