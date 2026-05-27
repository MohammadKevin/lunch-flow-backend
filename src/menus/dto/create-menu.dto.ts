import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

import { Transform } from 'class-transformer'

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  categoryId!: string

  @IsString()
  @IsNotEmpty()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @Transform(({ value }) =>
    parseFloat(value),
  )
  @IsNumber()
  @Min(0)
  price!: number

  @Transform(({ value }) =>
    parseInt(value),
  )
  @IsInt()
  @Min(0)
  stock!: number

  @IsOptional()
  @Transform(
    ({ value }) =>
      value === true ||
      value === 'true',
  )
  @IsBoolean()
  isAvailable?: boolean

  @IsOptional()
  @Transform(
    ({ value }) =>
      value === true ||
      value === 'true',
  )
  @IsBoolean()
  isRecommended?: boolean

  @IsOptional()
  @Transform(({ value }) =>
    parseInt(value),
  )
  @IsInt()
  @Min(1)
  preparationTime?: number
}