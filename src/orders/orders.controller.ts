import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'

import { OrdersService } from './orders.service'

import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  async createOrder(
    @Req() req: any,

    @Body()
    createOrderDto: CreateOrderDto,
  ) {
    return await this.ordersService.createOrder(
      req.user.id,
      createOrderDto,
    )
  }

  @Get()
  async getAllOrders() {
    return await this.ordersService.getAllOrders()
  }

  @Get('me')
  async getOrdersByUser(
    @Req() req: any,
  ) {
    return await this.ordersService.getOrdersByUser(
      req.user.id,
    )
  }

  @Get('seller/:sellerId')
  async getOrdersBySeller(
    @Param('sellerId')
    sellerId: string,
  ) {
    return await this.ordersService.getOrdersBySeller(
      sellerId,
    )
  }

  @Get(':id')
  async getOrderById(
    @Param('id')
    id: string,
  ) {
    return await this.ordersService.getOrderById(
      id,
    )
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id')
    id: string,

    @Body()
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return await this.ordersService.updateOrderStatus(
      id,
      updateOrderStatusDto,
    )
  }

  @Patch(':id/cancel')
  async cancelOrder(
    @Param('id')
    id: string,
  ) {
    return await this.ordersService.cancelOrder(
      id,
    )
  }

  @Get('favorites/me')
async getFavoriteMenus(
  @Req() req: any,
) {
  return await this.ordersService.getFavoriteMenus(
    req.user.id,
  )
}
}