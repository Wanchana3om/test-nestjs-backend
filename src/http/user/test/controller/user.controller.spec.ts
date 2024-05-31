import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { SignInDto } from '../../dto/sign-in.dto';
import { UserService } from '../../user.service';
import { UserController } from '../../user.controller';

const dto = {
  username: 'test',
} as SignInDto;

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    fakeUserService = {
      signIn: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();
    controller = module.get<UserController>(UserController);
  });

  it('should return ok', async () => {
    jest.spyOn(fakeUserService, 'signIn').mockResolvedValue();
    const response = await controller.signIn(dto);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('should throw an exception', async () => {
    const error = new Error('error');
    jest.spyOn(fakeUserService, 'signIn').mockRejectedValue(error);

    try {
      await controller.signIn(dto);
    } catch (error) {
      expect(error).toBe(error);
    }
  });
});
