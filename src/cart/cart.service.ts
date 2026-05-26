import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

import { CreateCartItemDto } from './dto/create-cart-item.dto'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getCart(userId: string) {
    const cart =
      await this.prisma.cart.findUnique({
        where: {
          userId,
        },

        include: {
          items: {
            include: {
              menu: true,
            },
          },
        },
      })

    if (!cart) {
      throw new NotFoundException(
        'Cart not found',
      )
    }

    const totalPrice =
      cart.items.reduce(
        (total, item) =>
          total +
          item.menu.price * item.quantity,
        0,
      )

    return {
      ...cart,

      totalPrice,
    }
  }

  async addToCart(
    userId: string,
    createCartItemDto: CreateCartItemDto,
  ) {
    const cart =
      await this.prisma.cart.findUnique({
        where: {
          userId,
        },
      })

    if (!cart) {
      throw new NotFoundException(
        'Cart not found',
      )
    }

    const menu =
      await this.prisma.menu.findUnique({
        where: {
          id: createCartItemDto.menuId,
        },
      })

    if (!menu) {
      throw new NotFoundException(
        'Menu not found',
      )
    }

    if (
      menu.stock <
      createCartItemDto.quantity
    ) {
      throw new BadRequestException(
        'Insufficient stock',
      )
    }

    const existingItem =
      await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,

          menuId:
            createCartItemDto.menuId,
        },
      })

    if (existingItem) {
      return await this.prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },

        data: {
          quantity:
            existingItem.quantity +
            createCartItemDto.quantity,

          notes:
            createCartItemDto.notes,
        },
      })
    }

    return await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,

        menuId:
          createCartItemDto.menuId,

        quantity:
          createCartItemDto.quantity,

        notes:
          createCartItemDto.notes,
      },
    })
  }

  async updateCartItem(
    cartItemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const cartItem =
      await this.prisma.cartItem.findUnique({
        where: {
          id: cartItemId,
        },

        include: {
          menu: true,
        },
      })

    if (!cartItem) {
      throw new NotFoundException(
        'Cart item not found',
      )
    }

    if (
      cartItem.menu.stock <
      updateCartItemDto.quantity
    ) {
      throw new BadRequestException(
        'Insufficient stock',
      )
    }

    return await this.prisma.cartItem.update({
      where: {
        id: cartItemId,
      },

      data: {
        quantity:
          updateCartItemDto.quantity,
      },
    })
  }

  async removeCartItem(
    cartItemId: string,
  ) {
    const cartItem =
      await this.prisma.cartItem.findUnique({
        where: {
          id: cartItemId,
        },
      })

    if (!cartItem) {
      throw new NotFoundException(
        'Cart item not found',
      )
    }

    await this.prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    })

    return {
      message:
        'Cart item removed successfully',
    }
  }

  async clearCart(userId: string) {
    const cart =
      await this.prisma.cart.findUnique({
        where: {
          userId,
        },
      })

    if (!cart) {
      throw new NotFoundException(
        'Cart not found',
      )
    }

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    })

    return {
      message:
        'Cart cleared successfully',
    }
  }
}