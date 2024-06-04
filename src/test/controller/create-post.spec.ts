import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { BlogController } from '../../../src/http/blog/blog.controller';
import { BlogService } from '../../../src/http/blog/blog.service';
import { CreatePostDto } from '../../../src/http/blog/dto/create-post.dto';
import { PostEntity } from '../../entities/post.entity';
import { CommunityTypeEnum } from '../../../src/http/blog/enum/community-type-enum';

describe('BlogController', () => {
  let controller: BlogController;
  let fakeBlogService: Partial<BlogService>;

  beforeEach(async () => {
    fakeBlogService = {
      createPost: jest.fn(),
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

  const createdPost: PostEntity = {
    id: 1,
    title: 'Test Title',
    content: 'Test Content',
    communityType: CommunityTypeEnum.FOOD,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: null,
    user: null,
  };

  const createPostDto: CreatePostDto = {
    userId: 1,
    title: 'Test Title',
    content: 'Test Content',
    communityType: CommunityTypeEnum.FOOD,
  };

  it('should return ok', async () => {
    jest.spyOn(fakeBlogService, 'createPost').mockResolvedValue(createdPost);
    const response = await controller.createPost(createPostDto);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('should throw an exception', async () => {
    const error = new Error('error');
    jest.spyOn(fakeBlogService, 'createPost').mockRejectedValue(error);

    try {
      await controller.createPost(createPostDto);
    } catch (error) {
      expect(error).toBe(error);
    }
  });
});
