import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getAllUsers() {
    return await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        sellerProfile: true,
      },
    })
  }

  async getAllCustomers() {
    return await this.prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getAllSellers() {
    return await this.prisma.user.findMany({
      where: {
        role: 'SELLER',
      },

      include: {
        sellerProfile: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getAllAdmins() {
    return await this.prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getUserById(id: string) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },

        include: {
          sellerProfile: true,

          orders: true,

          reviews: true,

          notifications: true,
        },
      })

    if (!user) {
      throw new NotFoundException(
        'User not found',
      )
    }

    return user
  }

  async getUserByEmail(
    email: string,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email,
        },

        include: {
          sellerProfile: true,
        },
      })

    if (!user) {
      throw new NotFoundException(
        'User not found',
      )
    }

    return user
  }

  async getUserProfile(
    id: string,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },

        select: {
          id: true,

          fullName: true,

          email: true,

          phone: true,

          profileImage: true,

          role: true,

          createdAt: true,
        },
      })

    if (!user) {
      throw new NotFoundException(
        'User not found',
      )
    }

    return user
  }

  async updateProfile(
    id: string,
    body: any,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },
      })

    if (!user) {
      throw new NotFoundException(
        'User not found',
      )
    }

    return await this.prisma.user.update({
      where: {
        id,
      },

      data: {
        fullName:
          body.fullName,

        phone:
          body.phone,
      },

      select: {
        id: true,

        fullName: true,

        email: true,

        phone: true,

        profileImage: true,

        role: true,
      },
    })
  }
}