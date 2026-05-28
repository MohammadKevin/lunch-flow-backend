import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common'

import { UsersService } from './users.service'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers()
  }

  @Get('customers')
  async getAllCustomers() {
    return await this.usersService.getAllCustomers()
  }

  @Get('sellers')
  async getAllSellers() {
    return await this.usersService.getAllSellers()
  }

  @Get('admins')
  async getAllAdmins() {
    return await this.usersService.getAllAdmins()
  }

  @Get('profile/:id')
  async getUserProfile(
    @Param('id') id: string,
  ) {
    return await this.usersService.getUserProfile(
      id,
    )
  }

  @Get('email/:email')
  async getUserByEmail(
    @Param('email')
    email: string,
  ) {
    return await this.usersService.getUserByEmail(
      email,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(
    @Req() req: any,
  ) {
    return await this.usersService.getUserProfile(
      req.user.id,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @Req() req: any,

    @Body() body: any,
  ) {
    return await this.usersService.updateProfile(
      req.user.id,
      body,
    )
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: string,
  ) {
    return await this.usersService.getUserById(
      id,
    )
  }
}