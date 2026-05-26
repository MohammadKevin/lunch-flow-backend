import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'

import { CartService } from './cart.service'

import { CreateCartItemDto } from './dto/create-cart-item.dto'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
  ) {}

  @Get()
  async getCart(
    @Req() req: any,
  ) {
    return await this.cartService.getCart(
      req.user.id,
    )
  }

  @Post()
  async addToCart(
    @Req() req: any,

    @Body()
    createCartItemDto: CreateCartItemDto,
  ) {
    return await this.cartService.addToCart(
      req.user.id,
      createCartItemDto,
    )
  }

  @Patch(':cartItemId')
  async updateCartItem(
    @Param('cartItemId')
    cartItemId: string,

    @Body()
    updateCartItemDto: UpdateCartItemDto,
  ) {
    return await this.cartService.updateCartItem(
      cartItemId,
      updateCartItemDto,
    )
  }

  @Delete(':cartItemId')
  async removeCartItem(
    @Param('cartItemId')
    cartItemId: string,
  ) {
    return await this.cartService.removeCartItem(
      cartItemId,
    )
  }

  @Delete()
  async clearCart(
    @Req() req: any,
  ) {
    return await this.cartService.clearCart(
      req.user.id,
    )
  }
}