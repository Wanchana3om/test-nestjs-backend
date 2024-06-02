import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { PostEntity } from '../../entities/post.entity'; // Adjust the import path
import { BlogService } from './blog.service';
import { CommentEntity } from '../../entities/comment.entity'; // Adjust the import path

describe('BlogService -> findById', () => {
  let postRepository: Repository<PostEntity>;
  let blogService: BlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(PostEntity),
          useValue: {
            findOne: jest.fn(),
          },
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

  it('should be ok', async () => {
    const postEntity: PostEntity = plainToInstance(PostEntity, {
      id: 1,
      title: 'test package',
      content: '0001LITEPACKAGE',
      communityType: 'Food',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(postEntity);

    const result = await blogService.getPostById(1);

    expect(result).toEqual(postEntity);
  });
});
