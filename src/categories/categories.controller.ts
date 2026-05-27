import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { Role } from '@prisma/client'

import { CategoriesService } from './categories.service'

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

import { Roles } from '../auth/decorators/roles.decorator'

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN)
  @Post()
  async createCategory(
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    return await this.categoriesService.createCategory(
      createCategoryDto,
    )
  }

  @Get()
  async getAllCategories() {
    return await this.categoriesService.getAllCategories()
  }

  @Get(':id')
  async getCategoryById(
    @Param('id') id: string,
  ) {
    return await this.categoriesService.getCategoryById(
      id,
    )
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,

    @Body()
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateCategory(
      id,
      updateCategoryDto,
    )
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteCategory(
    @Param('id') id: string,
  ) {
    return await this.categoriesService.deleteCategory(
      id,
    )
  }
}