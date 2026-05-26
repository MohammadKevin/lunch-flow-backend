import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'

import { Role } from '@prisma/client'

import * as bcrypt from 'bcrypt'

import { PrismaService } from '../prisma/prisma.service'

import { LoginDto } from './dto/login.dto'
import { RegisterCustomerDto } from './dto/register-customer.dto'
import { RegisterSellerDto } from './dto/register-seller.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      )
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials',
      )
    }

    return user
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(
      loginDto.email,
      loginDto.password,
    )

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken =
      await this.jwtService.signAsync(payload)

    return {
      message: 'Login successful',

      accessToken,

      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    }
  }

  async registerCustomer(
    registerCustomerDto: RegisterCustomerDto,
  ) {
    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email: registerCustomerDto.email,
        },
      })

    if (existingUser) {
      throw new BadRequestException(
        'Email already exists',
      )
    }

    const hashedPassword = await bcrypt.hash(
      registerCustomerDto.password,
      10,
    )

    const user = await this.prisma.user.create({
      data: {
        fullName: registerCustomerDto.fullName,
        email: registerCustomerDto.email,
        password: hashedPassword,
        phone: registerCustomerDto.phone,
        role: Role.CUSTOMER,

        cart: {
          create: {},
        },
      },
    })

    return {
      message:
        'Customer registered successfully',

      user,
    }
  }

  async registerSeller(
    registerSellerDto: RegisterSellerDto,
  ) {
    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email: registerSellerDto.email,
        },
      })

    if (existingUser) {
      throw new BadRequestException(
        'Email already exists',
      )
    }

    const hashedPassword = await bcrypt.hash(
      registerSellerDto.password,
      10,
    )

    const sellerCount =
      await this.prisma.seller.count()

    const storeNumber = `NO-${String(
      sellerCount + 1,
    ).padStart(2, '0')}`

    const user = await this.prisma.user.create({
      data: {
        fullName: registerSellerDto.fullName,
        email: registerSellerDto.email,
        password: hashedPassword,
        phone: registerSellerDto.phone,
        role: Role.SELLER,

        sellerProfile: {
          create: {
            storeNumber,
            storeName:
              registerSellerDto.storeName,
            ownerName:
              registerSellerDto.ownerName,
            phone: registerSellerDto.phone,
            address:
              registerSellerDto.address,
            description:
              registerSellerDto.description,
            openTime:
              registerSellerDto.openTime,
            closeTime:
              registerSellerDto.closeTime,
          },
        },
      },

      include: {
        sellerProfile: true,
      },
    })

    return {
      message:
        'Seller registration submitted successfully',

      user,
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },

      include: {
        sellerProfile: true,
      },
    })

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      )
    }

    return user
  }
}
