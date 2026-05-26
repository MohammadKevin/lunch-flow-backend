import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'

import { Role } from '@prisma/client'

import { SellersService } from './sellers.service'

import { UpdateSellerDto } from './dto/update-seller.dto'
import { RejectSellerDto } from './dto/reject-seller.dto'
import { UpdateStoreStatusDto } from './dto/update-store-status.dto'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

import { Roles } from '../auth/decorators/roles.decorator'

@Controller('sellers')
export class SellersController {
  constructor(
    private readonly sellersService: SellersService,
  ) {}

  @Get()
  async getAllSellers() {
    return await this.sellersService.getAllSellers()
  }

  @Get('pending')
  async getPendingSellers() {
    return await this.sellersService.getPendingSellers()
  }

  @Get('approved')
  async getApprovedSellers() {
    return await this.sellersService.getApprovedSellers()
  }

  @Get(':id')
  async getSellerById(
    @Param('id') id: string,
  ) {
    return await this.sellersService.getSellerById(
      id,
    )
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN)
  @Patch(':id/approve')
  async approveSeller(
    @Param('id') id: string,
  ) {
    return await this.sellersService.approveSeller(
      id,
    )
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN)
  @Patch(':id/reject')
  async rejectSeller(
    @Param('id') id: string,

    @Body()
    rejectSellerDto: RejectSellerDto,
  ) {
    return await this.sellersService.rejectSeller(
      id,
      rejectSellerDto,
    )
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Patch(':id')
  async updateSeller(
    @Param('id') id: string,

    @Body()
    updateSellerDto: UpdateSellerDto,
  ) {
    return await this.sellersService.updateSeller(
      id,
      updateSellerDto,
    )
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Patch(':id/store-status')
  async updateStoreStatus(
    @Param('id') id: string,

    @Body()
    updateStoreStatusDto: UpdateStoreStatusDto,
  ) {
    return await this.sellersService.updateStoreStatus(
      id,
      updateStoreStatusDto,
    )
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteSeller(
    @Param('id') id: string,
  ) {
    return await this.sellersService.deleteSeller(
      id,
    )
  }
}