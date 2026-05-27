import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

import { Type } from 'class-transformer'

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

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isAvailable?: boolean

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isRecommended?: boolean

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  preparationTime?: number
}
