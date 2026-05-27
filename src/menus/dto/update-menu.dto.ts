import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

import {
  Transform,
} from 'class-transformer'

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @Transform(({ value }) =>
    Number(value),
  )
  @IsNumber()
  @Min(0)
  price?: number

  @IsOptional()
  @Transform(({ value }) =>
    Number(value),
  )
  @IsInt()
  @Min(0)
  stock?: number

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