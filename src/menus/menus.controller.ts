import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MenusService } from './menus.service'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('menus')
export class MenusController {
  constructor(
    private readonly menusService: MenusService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image'),
  )
  @Post(':sellerId')
  async createMenu(
    @Param('sellerId')
    sellerId: string,

    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
      }),
    )
    createMenuDto: CreateMenuDto,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return await this.menusService.createMenu(
      sellerId,
      createMenuDto,
      file,
    )
  }

  @Get()
  async getAllMenus() {
    return await this.menusService.getAllMenus()
  }

  @Get('recommended')
  async getRecommendedMenus() {
    return await this.menusService.getRecommendedMenus()
  }

  @Get('available')
  async getAvailableMenus() {
    return await this.menusService.getAvailableMenus()
  }

  @Get('seller/:sellerId')
  async getMenusBySeller(
    @Param('sellerId')
    sellerId: string,
  ) {
    return await this.menusService.getMenusBySeller(
      sellerId,
    )
  }

  @Get(':id')
  async getMenuById(
    @Param('id')
    id: string,
  ) {
    return await this.menusService.getMenuById(
      id,
    )
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image'),
  )
  @Patch(':id')
  async updateMenu(
    @Param('id')
    id: string,

    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
      }),
    )
    updateMenuDto: UpdateMenuDto,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return await this.menusService.updateMenu(
      id,
      updateMenuDto,
      file,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMenu(
    @Param('id')
    id: string,
  ) {
    return await this.menusService.deleteMenu(
      id,
    )
  }
}