import {
  IsInt,
  Min,
} from 'class-validator'

export class UpdateQueueDto {
  @IsInt()
  @Min(1)
  currentPosition!: number

  @IsInt()
  @Min(1)
  estimatedWait!: number
}