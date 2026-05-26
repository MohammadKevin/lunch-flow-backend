import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

import { CloudinaryService } from '../cloudinary/cloudinary.service'

import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'

@Injectable()
export class MenusService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createMenu(
    sellerId: string,
    createMenuDto: CreateMenuDto,
    file?: Express.Multer.File,
  ) {
    let image: string | undefined
    let imagePublicId: string | undefined

    if (file) {
      const uploaded =
        await this.cloudinaryService.uploadFile(
          file,
          'menus',
        )

      image = uploaded.url

      imagePublicId = uploaded.publicId
    }

    return await this.prisma.menu.create({
      data: {
        sellerId,

        categoryId:
          createMenuDto.categoryId,

        name: createMenuDto.name,

        description:
          createMenuDto.description,

        image,

        imagePublicId,

        price: createMenuDto.price,

        stock: createMenuDto.stock,

        isAvailable:
          createMenuDto.isAvailable,

        isRecommended:
          createMenuDto.isRecommended,

        preparationTime:
          createMenuDto.preparationTime,
      },
    })
  }

  async getAllMenus() {
    return await this.prisma.menu.findMany({
      include: {
        seller: true,

        category: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getMenusBySeller(
    sellerId: string,
  ) {
    return await this.prisma.menu.findMany({
      where: {
        sellerId,
      },

      include: {
        category: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getRecommendedMenus() {
    return await this.prisma.menu.findMany({
      where: {
        isRecommended: true,
      },

      include: {
        seller: true,

        category: true,
      },
    })
  }

  async getAvailableMenus() {
    return await this.prisma.menu.findMany({
      where: {
        isAvailable: true,
      },

      include: {
        seller: true,

        category: true,
      },
    })
  }

  async getMenuById(id: string) {
    const menu =
      await this.prisma.menu.findUnique({
        where: {
          id,
        },

        include: {
          seller: true,

          category: true,

          reviews: {
            include: {
              user: true,
            },
          },
        },
      })

    if (!menu) {
      throw new NotFoundException(
        'Menu not found',
      )
    }

    return menu
  }

  async updateMenu(
    id: string,
    updateMenuDto: UpdateMenuDto,
    file?: Express.Multer.File,
  ) {
    const menu =
      await this.prisma.menu.findUnique({
        where: {
          id,
        },
      })

    if (!menu) {
      throw new NotFoundException(
        'Menu not found',
      )
    }

    let image: string | undefined

    let imagePublicId:
      | string
      | undefined

    if (file) {
      if (menu.imagePublicId) {
        await this.cloudinaryService.deleteFile(
          menu.imagePublicId,
        )
      }

      const uploaded =
        await this.cloudinaryService.uploadFile(
          file,
          'menus',
        )

      image = uploaded.url
      imagePublicId =
        uploaded.publicId
    }

    return await this.prisma.menu.update({
      where: {
        id,
      },

      data: {
        ...updateMenuDto,

        ...(image && {
          image,
        }),

        ...(imagePublicId && {
          imagePublicId,
        }),
      },
    })
  }

  async deleteMenu(id: string) {
    const menu =
      await this.prisma.menu.findUnique({
        where: {
          id,
        },
      })

    if (!menu) {
      throw new NotFoundException(
        'Menu not found',
      )
    }

    if (menu.imagePublicId) {
      await this.cloudinaryService.deleteFile(
        menu.imagePublicId,
      )
    }

    await this.prisma.menu.delete({
      where: {
        id,
      },
    })

    return {
      message:
        'Menu deleted successfully',
    }
  }
}