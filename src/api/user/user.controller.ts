import { Body, Controller, Post, Session } from '@nestjs/common';
import type { PartialUserSession } from 'src/domain/user-session.interface';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async createUser(@Body() user: UserDto) {
    await this.userService.registerUser(user);
  }

  @Post('user/login')
  async login(@Body() user: UserDto, @Session() session: PartialUserSession) {
    await this.userService.loginUser(user, session);
  }
}
