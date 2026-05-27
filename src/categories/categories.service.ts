import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ) {
    return await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
      },
    })
  }

  async getAllCategories() {
    return await this.prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getCategoryById(id: string) {
    const category =
      await this.prisma.category.findUnique({
        where: {
          id,
        },

        include: {
          menus: true,
        },
      })

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      )
    }

    return category
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category =
      await this.prisma.category.findUnique({
        where: {
          id,
        },
      })

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      )
    }

    return await this.prisma.category.update({
      where: {
        id,
      },

      data: updateCategoryDto,
    })
  }

  async deleteCategory(id: string) {
    const category =
      await this.prisma.category.findUnique({
        where: {
          id,
        },
      })

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      )
    }

    await this.prisma.category.delete({
      where: {
        id,
      },
    })

    return {
      message:
        'Category deleted successfully',
    }
  }
}