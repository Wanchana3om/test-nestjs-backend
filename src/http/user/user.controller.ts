import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiResource } from 'src/resource/api-resouce';

@Controller('sign-in')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const respond = await this.userService.signIn(signInDto);

      return ApiResource.successResponse(respond);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }
}
