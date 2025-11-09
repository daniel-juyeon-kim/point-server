import { Body, Controller, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { UserDto } from './dto/user.dto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('user')
  async createUser(@Body() user: UserDto) {
    await this.apiService.registerUser(user);
  }
}
