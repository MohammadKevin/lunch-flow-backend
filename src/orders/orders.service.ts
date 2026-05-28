import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import {
  OrderStatus,
  PaymentStatus,
} from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

import { NotificationsService } from '../notifications/notifications.service'

import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly notificationsService: NotificationsService,
  ) {}

  async createOrder(
  userId: string,
  createOrderDto: CreateOrderDto,
) {
  const cart =
    await this.prisma.cart.findFirst({
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

  if (!cart || cart.items.length === 0) {
    throw new BadRequestException(
      'Cart is empty',
    )
  }

  const seller =
    await this.prisma.seller.findUnique({
      where: {
        id: createOrderDto.sellerId,
      },
    })

  if (!seller) {
    throw new NotFoundException(
      'Seller not found',
    )
  }

  let totalPrice = 0

  for (const item of cart.items) {
    if (item.menu.stock < item.quantity) {
      throw new BadRequestException(
        `Insufficient stock for ${item.menu.name}`,
      )
    }

    totalPrice +=
      item.menu.price * item.quantity
  }

  const sellerQueueCount =
    await this.prisma.order.count({
      where: {
        sellerId:
          createOrderDto.sellerId,

        createdAt: {
          gte: new Date(
            new Date().setHours(
              0,
              0,
              0,
              0,
            ),
          ),
        },
      },
    })

  const queueNumber =
    sellerQueueCount + 1

  const orderCode = `ORD-${Date.now()}`

  const pickupCode = `PK-${Math.floor(
    100 + Math.random() * 900,
  )}`

  const order =
    await this.prisma.order.create({
      data: {
        userId,

        sellerId:
          createOrderDto.sellerId,

        orderCode,

        orderType:
          createOrderDto.orderType,

        queueNumber:
          createOrderDto.orderType ===
          'PICKUP'
            ? queueNumber
            : null,

        pickupCode:
          createOrderDto.orderType ===
          'PICKUP'
            ? pickupCode
            : null,

        deliveryAddress:
          createOrderDto.deliveryAddress,

        notes:
          createOrderDto.notes,

        totalPrice,

        items: {
          create:
            cart.items.map((item) => ({
              menuId: item.menuId,

              quantity: item.quantity,

              price: item.menu.price,

              subtotal:
                item.menu.price *
                item.quantity,

              notes: item.notes,
            })),
        },

        payment: {
          create: {
            paymentMethod:
              createOrderDto.paymentMethod,

            paymentStatus:
              PaymentStatus.UNPAID,
          },
        },

        queue:
          createOrderDto.orderType ===
          'PICKUP'
            ? {
                create: {
                  queueNumber,

                  currentPosition:
                    queueNumber,

                  estimatedWait:
                    queueNumber * 5,
                },
              }
            : undefined,
      },

      include: {
        items: {
          include: {
            menu: true,
          },
        },

        payment: true,

        queue: true,

        user: true,

        seller: true,
      },
    })

  for (const item of cart.items) {
    await this.prisma.menu.update({
      where: {
        id: item.menuId,
      },

      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    })
  }

  await this.prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  })

  await this.notificationsService.createNotification(
    order.userId,

    {
      title: 'Order Created',

      message: `Pesanan kamu berhasil dibuat dengan kode ${order.orderCode}`,
    },
  )

  if (order.user.phone) {
    await this.notificationsService.sendWhatsappNotification(
      order.user.phone,

      `Pesanan kamu berhasil dibuat 🍔\n\nOrder Code: ${order.orderCode}`,
    )
  }

  return {
    message:
      'Order created successfully',

    order,
  }
}

  async getAllOrders() {
    return await this.prisma.order.findMany({
      include: {
        user: true,

        seller: true,

        items: {
          include: {
            menu: true,
          },
        },

        payment: true,

        queue: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getOrdersByUser(
    userId: string,
  ) {
    return await this.prisma.order.findMany({
      where: {
        userId,
      },

      include: {
        seller: true,

        items: {
          include: {
            menu: true,
          },
        },

        payment: true,

        queue: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getOrdersBySeller(
    sellerId: string,
  ) {
    return await this.prisma.order.findMany({
      where: {
        sellerId,
      },

      include: {
        user: true,

        items: {
          include: {
            menu: true,
          },
        },

        payment: true,

        queue: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getOrderById(id: string) {
    const order =
      await this.prisma.order.findUnique({
        where: {
          id,
        },

        include: {
          user: true,

          seller: true,

          items: {
            include: {
              menu: true,
            },
          },

          payment: true,

          queue: true,
        },
      })

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      )
    }

    return order
  }

  async updateOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order =
      await this.prisma.order.findUnique({
        where: {
          id,
        },

        include: {
          user: true,
        },
      })

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      )
    }

    const updatedOrder =
      await this.prisma.order.update({
        where: {
          id,
        },

        data: {
          status:
            updateOrderStatusDto.status,
        },

        include: {
          user: true,
        },
      })

    let message = `Pesanan kamu sekarang ${updatedOrder.status}`

    if (
      updatedOrder.status ===
      OrderStatus.READY
    ) {
      message =
        'Pesanan kamu sudah siap diambil 🍔'

      if (updatedOrder.pickupCode) {
        message += `\nPickup Code: ${updatedOrder.pickupCode}`
      }
    }

    if (
      updatedOrder.status ===
      OrderStatus.ON_DELIVERY
    ) {
      message =
        'Pesanan kamu sedang diantar 🚚'
    }

    if (
      updatedOrder.status ===
      OrderStatus.COMPLETED
    ) {
      message =
        'Pesanan kamu selesai 🎉'
    }

    await this.notificationsService.createNotification(
      updatedOrder.userId,

      {
        title: 'Order Updated',

        message,
      },
    )

    if (updatedOrder.user.phone) {
      await this.notificationsService.sendWhatsappNotification(
        updatedOrder.user.phone,
        message,
      )
    }

    return updatedOrder
  }

  async cancelOrder(id: string) {
    const order =
      await this.prisma.order.findUnique({
        where: {
          id,
        },

        include: {
          items: true,

          user: true,
        },
      })

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      )
    }

    if (
      order.status ===
      OrderStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Completed order cannot be cancelled',
      )
    }

    for (const item of order.items) {
      await this.prisma.menu.update({
        where: {
          id: item.menuId,
        },

        data: {
          stock: {
            increment: item.quantity,
          },
        },
      })
    }

    const cancelledOrder =
      await this.prisma.order.update({
        where: {
          id,
        },

        data: {
          status:
            OrderStatus.CANCELLED,
        },

        include: {
          user: true,
        },
      })

    await this.notificationsService.createNotification(
      cancelledOrder.userId,

      {
        title: 'Order Cancelled',

        message:
          'Pesanan kamu berhasil dibatalkan',
      },
    )

    if (cancelledOrder.user.phone) {
      await this.notificationsService.sendWhatsappNotification(
        cancelledOrder.user.phone,

        'Pesanan kamu berhasil dibatalkan ❌',
      )
    }

    return cancelledOrder
  }

  async getFavoriteMenus(
  userId: string,
) {
  const orderItems =
    await this.prisma.orderItem.groupBy({
      by: ['menuId'],

      where: {
        order: {
          userId,
        },
      },

      _sum: {
        quantity: true,
      },

      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },

      take: 10,
    })

  const menuIds =
    orderItems.map(
      (item) => item.menuId,
    )

  const menus =
    await this.prisma.menu.findMany({
      where: {
        id: {
          in: menuIds,
        },
      },

      include: {
        seller: true,
        category: true,
      },
    })

  return menus.sort(
    (a, b) =>
      menuIds.indexOf(a.id) -
      menuIds.indexOf(b.id),
  )
}
}