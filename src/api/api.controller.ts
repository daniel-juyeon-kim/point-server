import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserSessionGuard } from 'src/user-session/user-session.guard';
import { PointHistoryEntity } from '../database/entity/point-history.entity';
import type { UserSession } from '../domain/user-session.interface';
import { ApiService } from './api.service';
import { EarnDto } from './dto/earn.dto';

@ApiTags('Point')
@ApiCookieAuth()
@UseGuards(UserSessionGuard)
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('earn')
  @ApiOperation({
    summary: '사용자 포인트 적립',
    description: '로그인한 사용자의 포인트를 적립합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '포인트 적립 성공, 업데이트된 잔액 반환',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: '로그인 필요 (세션 없음 또는 유효하지 않음)',
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @ApiBody({ type: EarnDto })
  earn(@Session() { userId }: UserSession, @Body() earnDto: EarnDto) {
    return this.apiService.earnPoints(userId, earnDto);
  }

  @Get('balance')
  @ApiOperation({
    summary: '잔액 조회',
    description: '로그인한 사용자의 현재 포인트 잔액을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '잔액 조회 성공', type: Number })
  @ApiResponse({
    status: 401,
    description: '로그인 필요 (세션 없음 또는 유효하지 않음)',
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  getBalance(@Session() { userId }: UserSession) {
    return this.apiService.getBalance(userId);
  }

  @Get('history')
  @ApiOperation({
    summary: '적립 및 차감 내역 조회',
    description:
      '로그인한 사용자의 포인트 적립 및 차감 내역을 조회합니다. 커서를 사용하여 페이지네이션을 지원합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '포인트 내역 조회 성공',
    type: [PointHistoryEntity],
  })
  @ApiResponse({
    status: 401,
    description: '로그인 필요 (세션 없음 또는 유효하지 않음)',
  })
  @ApiQuery({
    name: 'historyId',
    required: false,
    type: Number,
    description:
      '페이지네이션을 위한 커서 (이 historyId보다 작은 ID를 가진 내역을 조회)',
  })
  getHistory(
    @Session() { userId }: UserSession,
    @Query('historyId', new ParseIntPipe({ optional: true }))
    historyId?: number,
  ) {
    return this.apiService.getHistory(userId, historyId);
  }
}
