import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common'

import { NotificationsService } from './notifications.service'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  async getMyNotifications(
    @Req() req: any,
  ) {
    return await this.notificationsService.getMyNotifications(
      req.user.id,
    )
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id')
    id: string,
  ) {
    return await this.notificationsService.markAsRead(
      id,
    )
  }

  @Delete(':id')
  async deleteNotification(
    @Param('id')
    id: string,
  ) {
    return await this.notificationsService.deleteNotification(
      id,
    )
  }
}