import { Body, Controller, Post, Session } from '@nestjs/common';
import type { UserSession } from '../domain/user-session.interface';
import { ApiService } from './api.service';
import { UserDto } from './dto/user.dto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('user')
  async createUser(@Body() user: UserDto) {
    await this.apiService.registerUser(user);
  }

  @Post('user/login')
  async login(@Body() user: UserDto, @Session() session: UserSession) {
    await this.apiService.loginUser(user, session);
  }
}
