import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty()
  storeName!: string

  @IsString()
  @IsNotEmpty()
  ownerName!: string

  @IsString()
  @IsNotEmpty()
  phone!: string

  @IsString()
  @IsNotEmpty()
  address!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  openTime?: string

  @IsOptional()
  @IsString()
  closeTime?: string
}