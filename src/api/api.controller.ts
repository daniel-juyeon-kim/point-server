import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserSessionGuard } from 'src/user-session/user-session.guard';
import type { UserSession } from '../domain/user-session.interface';
import { ApiService } from './api.service';
import { EarnDto } from './dto/earn.dto';

@UseGuards(UserSessionGuard)
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('earn')
  earn(@Session() { userId }: UserSession, @Body() earnDto: EarnDto) {
    return this.apiService.earnPoints(userId, earnDto);
  }

  @Get('balance')
  getBalance(@Session() { userId }: UserSession) {
    return this.apiService.getBalance(userId);
  }
}
