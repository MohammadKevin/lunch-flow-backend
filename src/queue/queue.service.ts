import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

import { UpdateQueueDto } from './dto/update-queue.dto'

@Injectable()
export class QueueService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getAllQueues() {
    return await this.prisma.queue.findMany({
      include: {
        order: true,
      },

      orderBy: {
        queueNumber: 'asc',
      },
    })
  }

  async getQueueByOrder(
    orderId: string,
  ) {
    const queue =
      await this.prisma.queue.findUnique({
        where: {
          orderId,
        },

        include: {
          order: true,
        },
      })

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      )
    }

    return queue
  }

  async updateQueue(
    id: string,
    updateQueueDto: UpdateQueueDto,
  ) {
    const queue =
      await this.prisma.queue.findUnique({
        where: {
          id,
        },
      })

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      )
    }

    return await this.prisma.queue.update({
      where: {
        id,
      },

      data: {
        currentPosition:
          updateQueueDto.currentPosition,

        estimatedWait:
          updateQueueDto.estimatedWait,
      },
    })
  }

  async deleteQueue(id: string) {
    const queue =
      await this.prisma.queue.findUnique({
        where: {
          id,
        },
      })

    if (!queue) {
      throw new NotFoundException(
        'Queue not found',
      )
    }

    await this.prisma.queue.delete({
      where: {
        id,
      },
    })

    return {
      message:
        'Queue deleted successfully',
    }
  }
}