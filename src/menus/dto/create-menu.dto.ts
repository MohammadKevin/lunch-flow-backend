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

  @Transform(({ value }) => {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return 0
    }

    return Number(value)
  })
  @IsNumber()
  @Min(0)
  price!: number

  @Transform(({ value }) => {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return 0
    }

    return Number(value)
  })
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
  @Transform(({ value }) => {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return 1
    }

    return Number(value)
  })
  @IsInt()
  @Min(1)
  preparationTime?: number
}