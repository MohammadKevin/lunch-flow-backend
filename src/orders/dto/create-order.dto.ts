import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'

import {
  OrderType,
  PaymentMethod,
} from '@prisma/client'

export class CreateOrderDto {
  @IsString()
  sellerId!: string

  @IsEnum(OrderType)
  orderType!: OrderType

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod

  @IsOptional()
  @IsString()
  deliveryAddress?: string

  @IsOptional()
  @IsString()
  notes?: string
}