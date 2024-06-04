import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignInDto } from './dto/sign-in.dto';
import { Resource } from '../../resource/resource';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      const response = await this.userService.getProfile(req.user);
      return Resource.successResponse(response);
    } catch (error) {
      return Resource.errorResponse(error);
    }
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const response = await this.userService.signIn(signInDto);
      return Resource.successResponse(response);
    } catch (error) {
      return Resource.errorResponse(error);
    }
  }
}
