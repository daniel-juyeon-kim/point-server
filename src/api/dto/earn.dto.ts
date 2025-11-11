import { IsNumber, IsPositive } from 'class-validator';

export class EarnDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}
