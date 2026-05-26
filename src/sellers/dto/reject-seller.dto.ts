import {
  IsNotEmpty,
  IsString,
} from 'class-validator'

export class RejectSellerDto {
  @IsString()
  @IsNotEmpty()
  rejectReason!: string
}