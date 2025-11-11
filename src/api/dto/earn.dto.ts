import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class EarnDto {
  @ApiProperty({ description: '적립할 포인트 금액', example: 500 })
  @IsNumber()
  @IsPositive()
  amount: number;
}
