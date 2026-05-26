import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import axios from 'axios'

import { ConfigService } from '@nestjs/config'

import { PrismaService } from '../prisma/prisma.service'

import { CreateNotificationDto } from './dto/create-notification.dto'

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly configService: ConfigService,
  ) {}

  async createNotification(
    userId: string,
    createNotificationDto: CreateNotificationDto,
  ) {
    return await this.prisma.notification.create({
      data: {
        userId,

        title:
          createNotificationDto.title,

        message:
          createNotificationDto.message,
      },
    })
  }

  async getMyNotifications(
    userId: string,
  ) {
    return await this.prisma.notification.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async markAsRead(id: string) {
    const notification =
      await this.prisma.notification.findUnique({
        where: {
          id,
        },
      })

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      )
    }

    return await this.prisma.notification.update({
      where: {
        id,
      },

      data: {
        isRead: true,
      },
    })
  }

  async deleteNotification(id: string) {
    const notification =
      await this.prisma.notification.findUnique({
        where: {
          id,
        },
      })

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      )
    }

    await this.prisma.notification.delete({
      where: {
        id,
      },
    })

    return {
      message:
        'Notification deleted successfully',
    }
  }

  async sendWhatsappNotification(
    phone: string,
    message: string,
  ) {
    const token =
      this.configService.get<string>(
        'FONNTE_TOKEN',
      )

    const device =
      this.configService.get<string>(
        'FONNTE_DEVICE',
      )

    try {
      const response = await axios.post(
        'https://api.fonnte.com/send',

        {
          target: phone,

          message,

          device,
        },

        {
          headers: {
            Authorization: token,
          },
        },
      )

      return response.data
    } catch (error) {
      console.log(error)

      return null
    }
  }
}