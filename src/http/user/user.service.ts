import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { UserEntity } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async signIn(parameter: SignInDto) {
    const username = parameter.username;

    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (user) {
      return {
        accessToken: this.jwtService.sign({
          id: user.id,
          username: user.username,
        }),
        id: user.id,
        username: user.username,
      };
    }

    const newUser = new UserEntity();
    newUser.username = username;

    try {
      const savedUser = await this.userRepository.save(newUser);
      return {
        accessToken: this.jwtService.sign({
          id: savedUser.id,
          username: savedUser.username,
        }),
        id: savedUser.id,
        username: savedUser.username,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to sign in: ${error.message}`);
    }
  }

  async getProfile(parameter: any) {
    const user = { id: parameter.id, username: parameter.username };

    return user;
  }
}
