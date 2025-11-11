import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { UserSessionGuard } from 'src/user-session/user-session.guard';
import type { UserSession } from '../domain/user-session.interface';
import { ApiService } from './api.service';
import { EarnDto } from './dto/earn.dto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('earn')
  @UseGuards(UserSessionGuard)
  earn(@Session() { userId }: UserSession, @Body() earnDto: EarnDto) {
    return this.apiService.earnPoints(userId, earnDto);
  }
}
