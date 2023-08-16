import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private saltRounds = 10;

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.find(username);
    if (user == null) {
      return null;
    }
    const match = bcrypt.compareSync(pass, user.password);
    if (match) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signup(username: string, password: string): Promise<any> {
    const hash = bcrypt.hashSync(password, this.saltRounds);
    const payload = { username: username, password: hash };
    return this.userService.createUser(payload).then(function (result) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...res } = result;
      return res;
    });
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async deleteUser(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return this.userService.deleteUser(payload.username);
  }
}
