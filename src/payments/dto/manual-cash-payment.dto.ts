import {
  IsString,
  IsOptional,
} from 'class-validator'

export class ManualCashPaymentDto {
  @IsOptional()
  @IsString()
  notes?: string
}