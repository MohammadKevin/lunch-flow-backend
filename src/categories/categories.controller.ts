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

import { CategoriesService } from './categories.service'

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':sellerId')
  async createCategory(
    @Param('sellerId') sellerId: string,

    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    return await this.categoriesService.createCategory(
      sellerId,
      createCategoryDto,
    )
  }

  @Get()
  async getAllCategories() {
    return await this.categoriesService.getAllCategories()
  }

  @Get('seller/:sellerId')
  async getCategoriesBySeller(
    @Param('sellerId') sellerId: string,
  ) {
    return await this.categoriesService.getCategoriesBySeller(
      sellerId,
    )
  }

  @Get(':id')
  async getCategoryById(
    @Param('id') id: string,
  ) {
    return await this.categoriesService.getCategoryById(
      id,
    )
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCategory(
    @Param('id') id: string,
  ) {
    return await this.categoriesService.deleteCategory(
      id,
    )
  }
}