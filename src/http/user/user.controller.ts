import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { SignInDto } from './dto/sign-in.dto';
import { Resource } from '../../resource/resource';

@Controller('sign-in')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const response = await this.userService.signIn(signInDto);
      return Resource.successResponse(response);
    } catch (error) {
      return Resource.errorResponse(error);
    }
  }
}
