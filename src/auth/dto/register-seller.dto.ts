  import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
  } from 'class-validator'

  export class RegisterSellerDto {
    @IsString()
    @IsNotEmpty()
    fullName: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string

    @IsString()
    @IsNotEmpty()
    phone: string

    @IsString()
    @IsNotEmpty()
    storeName: string

    @IsString()
    @IsNotEmpty()
    ownerName: string

    @IsString()
    @IsNotEmpty()
    address: string

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