import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator'

export class UpdateSellerDto {
  @IsOptional()
  @IsString()
  storeName?: string

  @IsOptional()
  @IsString()
  ownerName?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  openTime?: string

  @IsOptional()
  @IsString()
  closeTime?: string

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean
}