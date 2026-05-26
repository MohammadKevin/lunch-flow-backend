import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class CreateCartItemDto {
  @IsString()
  @IsNotEmpty()
  menuId!: string

  @IsInt()
  @Min(1)
  quantity!: number

  @IsOptional()
  @IsString()
  notes?: string
}