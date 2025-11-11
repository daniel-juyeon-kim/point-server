import { Body, Controller, Post, Session } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { PartialUserSession } from 'src/domain/user-session.interface';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: '사용자 회원가입',
    description: '새로운 사용자를 등록합니다.',
  })
  @ApiResponse({ status: 201, description: '사용자 등록 성공' })
  @ApiResponse({ status: 409, description: '이미 존재하는 사용자 ID' })
  @ApiBody({ type: UserDto })
  async createUser(@Body() user: UserDto) {
    await this.userService.registerUser(user);
  }

  @Post('login')
  @ApiOperation({
    summary: '사용자 로그인',
    description: '사용자 인증 후 세션 쿠키를 발급합니다.',
  })
  @ApiResponse({ status: 201, description: '로그인 성공, 세션 쿠키 발급' })
  @ApiResponse({ status: 401, description: '잘못된 아이디 또는 비밀번호' })
  @ApiBody({ type: UserDto })
  async login(@Body() user: UserDto, @Session() session: PartialUserSession) {
    await this.userService.loginUser(user, session);
  }
}
