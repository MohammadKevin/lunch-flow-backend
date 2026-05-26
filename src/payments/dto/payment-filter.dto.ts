import {
  IsEnum,
  IsOptional,
} from 'class-validator'

import { PaymentStatus } from '@prisma/client'

export class PaymentFilterDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus
}