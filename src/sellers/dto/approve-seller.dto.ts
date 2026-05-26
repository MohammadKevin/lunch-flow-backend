import {
  IsEnum,
} from 'class-validator'

import { SellerStatus } from '@prisma/client'

export class ApproveSellerDto {
  @IsEnum(SellerStatus)
  status!: SellerStatus
}