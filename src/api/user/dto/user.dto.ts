import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: '사용자 ID', example: 'testuser' })
  @IsString()
  id: string;

  @ApiProperty({ description: '사용자 비밀번호', example: 'password123' })
  @IsString()
  password: string;
}
