import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signIn(parameter: SignInDto): Promise<void> {
    const username = parameter.username;

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const newUser = new UserEntity();
    newUser.username = username;

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
