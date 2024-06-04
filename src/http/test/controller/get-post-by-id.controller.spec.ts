import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { BlogController } from '../../blog/blog.controller';
import { BlogService } from '../../blog/blog.service';
import { PostEntity } from 'src/entities/post.entity';
import { CommunityTypeEnum } from '../../../entities/community-type-enum';

describe('BlogController', () => {
  let controller: BlogController;
  let fakeBlogService: Partial<BlogService>;

  beforeEach(async () => {
    fakeBlogService = {
      getPostById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        {
          provide: BlogService,
          useValue: fakeBlogService,
        },
      ],
    }).compile();
    controller = module.get<BlogController>(BlogController);
  });

  const mockPost: PostEntity = {
    id: 1,
    title: 'test',
    content: 'test',
    communityType: CommunityTypeEnum.EXERCISE,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: null,
    user: null,
  };

  it('should return ok', async () => {
    jest.spyOn(fakeBlogService, 'getPostById').mockResolvedValue(mockPost);
    const response = await controller.getPostById(1);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('should throw an exception', async () => {
    const error = new Error('error');
    jest.spyOn(fakeBlogService, 'getPostById').mockRejectedValue(error);

    try {
      await controller.getPostById(1);
    } catch (error) {
      expect(error).toBe(error);
    }
  });
});
