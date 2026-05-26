import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { SellerStatus } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

import { UpdateSellerDto } from './dto/update-seller.dto'
import { RejectSellerDto } from './dto/reject-seller.dto'
import { UpdateStoreStatusDto } from './dto/update-store-status.dto'

@Injectable()
export class SellersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getAllSellers() {
    return await this.prisma.seller.findMany({
      include: {
        user: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getPendingSellers() {
    return await this.prisma.seller.findMany({
      where: {
        status: SellerStatus.PENDING,
      },

      include: {
        user: true,
      },
    })
  }

  async getApprovedSellers() {
    return await this.prisma.seller.findMany({
      where: {
        status: SellerStatus.APPROVED,
      },

      include: {
        user: true,
      },
    })
  }

  async getSellerById(id: string) {
    const seller =
      await this.prisma.seller.findUnique({
        where: {
          id,
        },

        include: {
          user: true,
          categories: true,
          menus: true,
        },
      })

    if (!seller) {
      throw new NotFoundException(
        'Seller not found',
      )
    }

    return seller
  }

  async approveSeller(id: string) {
    const seller =
      await this.prisma.seller.findUnique({
        where: {
          id,
        },
      })

    if (!seller) {
      throw new NotFoundException(
        'Seller not found',
      )
    }

    return await this.prisma.seller.update({
      where: {
        id,
      },

      data: {
        status: SellerStatus.APPROVED,
        rejectReason: null,
      },
    })
  }

  async rejectSeller(
    id: string,
    rejectSellerDto: RejectSellerDto,
  ) {
    const seller =
      await this.prisma.seller.findUnique({
        where: {
          id,
        },
      })

    if (!seller) {
      throw new NotFoundException(
        'Seller not found',
      )
    }

    return await this.prisma.seller.update({
      where: {
        id,
      },

      data: {
        status: SellerStatus.REJECTED,
        rejectReason:
          rejectSellerDto.rejectReason,
      },
    })
  }

  async updateSeller(
    id: string,
    updateSellerDto: UpdateSellerDto,
  ) {
    const seller =
      await this.prisma.seller.findUnique({
        where: {
          id,
        },
      })

    if (!seller) {
      throw new NotFoundException(
        'Seller not found',
      )
    }

    return await this.prisma.seller.update({
      where: {
        id,
      },

      data: updateSellerDto,
    })
  }

  async updateStoreStatus(
    id: string,
    updateStoreStatusDto: UpdateStoreStatusDto,
  ) {
    const seller =
      await this.prisma.seller.findUnique({
        where: {
          id,
        },
      })

    if (!seller) {
      throw new NotFoundException(
        'Seller not found',
      )
    }

    return await this.prisma.seller.update({
      where: {
        id,
      },

      data: {
        isOpen:
          updateStoreStatusDto.isOpen,
      },
    })
  }

  async deleteSeller(id: string) {
    const seller =
      await this.prisma.seller.findUnique({
        where: {
          id,
        },
      })

    if (!seller) {
      throw new NotFoundException(
        'Seller not found',
      )
    }

    await this.prisma.seller.delete({
      where: {
        id,
      },
    })

    const sellers =
      await this.prisma.seller.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      })

    for (let i = 0; i < sellers.length; i++) {
      await this.prisma.seller.update({
        where: {
          id: sellers[i].id,
        },

        data: {
          storeNumber: `NO-${String(
            i + 1,
          ).padStart(2, '0')}`,
        },
      })
    }

    return {
      message:
        'Seller deleted successfully',
    }
  }
}