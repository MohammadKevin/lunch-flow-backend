import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common'

import { QueueService } from './queue.service'

import { UpdateQueueDto } from './dto/update-queue.dto'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('queue')
export class QueueController {
  constructor(
    private readonly queueService: QueueService,
  ) {}

  @Get()
  async getAllQueues() {
    return await this.queueService.getAllQueues()
  }

  @Get('order/:orderId')
  async getQueueByOrder(
    @Param('orderId')
    orderId: string,
  ) {
    return await this.queueService.getQueueByOrder(
      orderId,
    )
  }

  @Patch(':id')
  async updateQueue(
    @Param('id')
    id: string,

    @Body()
    updateQueueDto: UpdateQueueDto,
  ) {
    return await this.queueService.updateQueue(
      id,
      updateQueueDto,
    )
  }

  @Delete(':id')
  async deleteQueue(
    @Param('id')
    id: string,
  ) {
    return await this.queueService.deleteQueue(
      id,
    )
  }
}