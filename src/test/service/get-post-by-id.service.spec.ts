import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../entities/post.entity';
import { BlogService } from '../../../src/http/blog/blog.service';
import { CommentEntity } from '../../entities/comment.entity';
import { NotFoundException } from '@nestjs/common';

describe('BlogService -> getPostById', () => {
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

  it('should find a post by ID', async () => {
    jest.spyOn(postRepository, 'createQueryBuilder').mockImplementation(
      () =>
        ({
          where: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          addOrderBy: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue({
            id: 1,
            title: 'Test Post',
            content: 'This is a test post',
            comments: [],
            user: {},
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        }) as any,
    );

    const postId = 1;
    const result = await blogService.getPostById(postId);

    expect(result).toBeDefined();
    expect(result.id).toBe(postId);
    expect(result.title).toBe('Test Post');
    expect(result.content).toBe('This is a test post');
  });

  it('should throw a NotFoundException if post is not found', async () => {
    jest.spyOn(postRepository, 'createQueryBuilder').mockImplementation(
      () =>
        ({
          where: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          addOrderBy: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null),
        }) as any,
    );

    const postId = 1;

    await expect(blogService.getPostById(postId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
