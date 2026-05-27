import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

import {
  Transform,
  Type,
} from 'class-transformer'

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
    Number(value),
  )
  @IsNumber()
  @Min(0)
  price!: number

  @Transform(({ value }) =>
    Number(value),
  )
  @IsInt()
  @Min(0)
  stock!: number

  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true',
  )
  @IsBoolean()
  isAvailable?: boolean

  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true',
  )
  @IsBoolean()
  isRecommended?: boolean

  @IsOptional()
  @Transform(({ value }) =>
    Number(value),
  )
  @IsInt()
  @Min(1)
  preparationTime?: number
}