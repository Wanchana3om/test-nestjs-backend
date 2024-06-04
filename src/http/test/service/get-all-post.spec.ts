import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../../entities/post.entity';
import { BlogService } from '../../blog/blog.service';
import { CommentEntity } from '../../../entities/comment.entity';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { plainToClass } from 'class-transformer';
import { CommunityTypeEnum } from '../../../entities/community-type-enum';

jest.mock('nestjs-typeorm-paginate');

describe('BlogService -> getAllPost', () => {
  let postRepository: Repository<PostEntity>;
  let blogService: BlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: getRepositoryToken(PostEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CommentEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    blogService = module.get<BlogService>(BlogService);
    postRepository = module.get<Repository<PostEntity>>(
      getRepositoryToken(PostEntity),
    );
  });

  it('should return paginated posts', async () => {
    const mockPosts = [
      plainToClass(PostEntity, {
        id: 1,
        title: 'Test Post 1',
        content: 'This is a test post 1',
        comments: [{ id: 1, content: 'Test comment', user: {} }],
        user: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        communityType: CommunityTypeEnum.EXERCISE,
        userId: 1,
      }),
      plainToClass(PostEntity, {
        id: 2,
        title: 'Test Post 2',
        content: 'This is a test post 2',
        comments: [{ id: 2, content: 'Test comment', user: {} }],
        user: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        communityType: CommunityTypeEnum.EXERCISE,
        userId: 1,
      }),
    ];

    const paginationResult: Pagination<PostEntity> = {
      items: mockPosts,
      meta: {
        itemCount: mockPosts.length,
        totalItems: mockPosts.length,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    };

    jest.spyOn(postRepository, 'createQueryBuilder').mockImplementation(
      () =>
        ({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          addOrderBy: jest.fn().mockReturnThis(),
        }) as any,
    );

    (paginate as jest.Mock).mockResolvedValue(paginationResult);

    const parameters = { page: 1, perPage: 10 };
    const result = await blogService.getAllPost(parameters);

    expect(result).toEqual(paginationResult);
  });
});
