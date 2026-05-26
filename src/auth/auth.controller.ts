import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'

import { AuthService } from './auth.service'

import { LoginDto } from './dto/login.dto'
import { RegisterCustomerDto } from './dto/register-customer.dto'
import { RegisterSellerDto } from './dto/register-seller.dto'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ) {
    return await this.authService.login(
      loginDto,
    )
  }

  @Post('register/customer')
  async registerCustomer(
    @Body()
    registerCustomerDto: RegisterCustomerDto,
  ) {
    return await this.authService.registerCustomer(
      registerCustomerDto,
    )
  }

  @Post('register/seller')
  async registerSeller(
    @Body()
    registerSellerDto: RegisterSellerDto,
  ) {
    return await this.authService.registerSeller(
      registerSellerDto,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @Req() req: any,
  ) {
    return await this.authService.getProfile(
      req.user.id,
    )
  }
}