import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import {
  PaymentStatus,
} from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

import { CloudinaryService } from '../cloudinary/cloudinary.service'

import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto'

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAllPayments() {
    return await this.prisma.payment.findMany({
      include: {
        order: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getPaymentById(id: string) {
    const payment =
      await this.prisma.payment.findUnique({
        where: {
          id,
        },

        include: {
          order: true,
        },
      })

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      )
    }

    return payment
  }

  async uploadPaymentProof(
    paymentId: string,
    file?: Express.Multer.File,
  ) {
    const payment =
      await this.prisma.payment.findUnique({
        where: {
          id: paymentId,
        },
      })

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      )
    }

    let paymentProof:
      | string
      | undefined

    let paymentProofPublicId:
      | string
      | undefined

    if (file) {
      if (
        payment.paymentProofPublicId
      ) {
        await this.cloudinaryService.deleteFile(
          payment.paymentProofPublicId,
        )
      }

      const uploaded =
        await this.cloudinaryService.uploadFile(
          file,
          'payments',
        )

      paymentProof = uploaded.url

      paymentProofPublicId =
        uploaded.publicId
    }

    return await this.prisma.payment.update({
      where: {
        id: paymentId,
      },

      data: {
        paymentProof,

        paymentProofPublicId,
      },
    })
  }

  async updatePaymentStatus(
    id: string,
    updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    const payment =
      await this.prisma.payment.findUnique({
        where: {
          id,
        },
      })

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      )
    }

    return await this.prisma.payment.update({
      where: {
        id,
      },

      data: {
        paymentStatus:
          updatePaymentStatusDto.paymentStatus,

        paidAt:
          updatePaymentStatusDto.paymentStatus ===
          PaymentStatus.PAID
            ? new Date()
            : null,
      },
    })
  }

  async deletePaymentProof(
    paymentId: string,
  ) {
    const payment =
      await this.prisma.payment.findUnique({
        where: {
          id: paymentId,
        },
      })

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      )
    }

    if (
      payment.paymentProofPublicId
    ) {
      await this.cloudinaryService.deleteFile(
        payment.paymentProofPublicId,
      )
    }

    return await this.prisma.payment.update({
      where: {
        id: paymentId,
      },

      data: {
        paymentProof: null,

        paymentProofPublicId:
          null,
      },
    })
  }

  async getPaymentsBySeller(
  sellerId: string,
) {
  return await this.prisma.payment.findMany({
    where: {
      order: {
        sellerId,
      },
    },

    include: {
      order: {
        include: {
          user: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  })
}
}