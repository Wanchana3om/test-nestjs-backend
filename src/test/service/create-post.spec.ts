import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../entities/post.entity';
import { BlogService } from '../../../src/http/blog/blog.service';
import { CommentEntity } from '../../entities/comment.entity';
import { BadRequestException } from '@nestjs/common';
import { CreatePostDto } from '../../../src/http/blog/dto/create-post.dto';
import { plainToClass } from 'class-transformer';
import { CommunityTypeEnum } from '../../http/blog/enum/community-type-enum';

jest.mock('nestjs-typeorm-paginate');

describe('BlogService -> createPost', () => {
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

  it('should create a new post', async () => {
    const createPostDto: CreatePostDto = {
      title: 'Test Post',
      content: 'This is a test post',
      communityType: CommunityTypeEnum.EXERCISE,
      userId: 1,
    };

    const newPost = plainToClass(PostEntity, createPostDto);

    jest.spyOn(postRepository, 'create').mockReturnValue(newPost);
    jest.spyOn(postRepository, 'save').mockResolvedValue(newPost);

    const result = await blogService.createPost(createPostDto);

    expect(result).toEqual(newPost);
  });

  it('should throw a BadRequestException if failed to create post', async () => {
    const createPostDto: CreatePostDto = {
      title: 'Test Post',
      content: 'This is a test post',
      communityType: CommunityTypeEnum.EXERCISE,
      userId: 1,
    };

    const error = new Error('Failed to save post');
    jest.spyOn(postRepository, 'create').mockImplementation(() => {
      throw error;
    });

    await expect(blogService.createPost(createPostDto)).rejects.toThrowError(
      BadRequestException,
    );
    expect(postRepository.create).toHaveBeenCalledWith(createPostDto);
  });
});
