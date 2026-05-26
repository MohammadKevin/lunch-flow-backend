import {
  IsNotEmpty,
  IsString,
} from 'class-validator'

export class UploadQrisDto {
  @IsString()
  @IsNotEmpty()
  qrisImage!: string
}