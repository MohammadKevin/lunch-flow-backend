import {
  Controller,
  Get,
  Param,
} from '@nestjs/common'

import { UsersService } from './users.service'

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
    return await this.usersService.getUserProfile(id)
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: string,
  ) {
    return await this.usersService.getUserById(id)
  }

  @Get('email/:email')
  async getUserByEmail(
    @Param('email') email: string,
  ) {
    return await this.usersService.getUserByEmail(email)
  }
}