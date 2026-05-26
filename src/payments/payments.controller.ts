import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'

import { PaymentsService } from './payments.service'

import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get()
  async getAllPayments() {
    return await this.paymentsService.getAllPayments()
  }

  @Get(':id')
  async getPaymentById(
    @Param('id')
    id: string,
  ) {
    return await this.paymentsService.getPaymentById(
      id,
    )
  }

  @UseInterceptors(
    FileInterceptor(
      'paymentProof',
    ),
  )
  @Patch(':id/upload-proof')
  async uploadPaymentProof(
    @Param('id')
    id: string,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return await this.paymentsService.uploadPaymentProof(
      id,
      file,
    )
  }

  @Patch(':id/status')
  async updatePaymentStatus(
    @Param('id')
    id: string,

    @Body()
    updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    return await this.paymentsService.updatePaymentStatus(
      id,
      updatePaymentStatusDto,
    )
  }

  @Delete(':id/proof')
  async deletePaymentProof(
    @Param('id')
    id: string,
  ) {
    return await this.paymentsService.deletePaymentProof(
      id,
    )
  }
}