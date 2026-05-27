import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

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

  @IsNumber()
  @Min(0)
  price!: number

  @IsInt()
  @Min(0)
  stock!: number

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean

  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean

  @IsOptional()
  @IsInt()
  @Min(1)
  preparationTime?: number
}
