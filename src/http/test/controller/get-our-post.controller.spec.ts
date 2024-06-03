import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { BlogController } from '../../blog/blog.controller';
import { BlogService } from '../../blog/blog.service';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { PostEntity } from 'src/entities/post.entity';
import { CommunityTypeEnum } from '../../../entities/community-type-enum';

describe('BlogController', () => {
  let controller: BlogController;
  let fakeBlogService: Partial<BlogService>;

  beforeEach(async () => {
    fakeBlogService = {
      getOurPost: jest.fn(),
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

  const mockPosts: Pagination<PostEntity, IPaginationMeta> = {
    items: [
      {
        id: 1,
        title: 'test',
        content: 'test',
        communityType: CommunityTypeEnum.EXERCISE,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: null,
        user: null,
      },
      {
        id: 2,
        title: 'test',
        content: 'test',
        communityType: CommunityTypeEnum.EXERCISE,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: null,
        user: null,
      },
    ],
    meta: {
      itemCount: 2,
      totalItems: 2,
      itemsPerPage: 10,
      totalPages: 10,
      currentPage: 1,
    },
  };
  it('should return ok', async () => {
    jest.spyOn(fakeBlogService, 'getOurPost').mockResolvedValue(mockPosts);
    const response = await controller.getOurPost(1, {});
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(response.data.length).toEqual(2);
  });

  it('should throw an exception', async () => {
    const error = new Error('error');
    jest.spyOn(fakeBlogService, 'getOurPost').mockRejectedValue(error);

    try {
      await controller.getOurPost(2, {});
    } catch (error) {
      expect(error).toBe(error);
    }
  });
});
