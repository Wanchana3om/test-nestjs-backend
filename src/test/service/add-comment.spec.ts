import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../entities/post.entity';
import { BlogService } from '../../http/blog/blog.service';
import { CommentEntity } from '../../entities/comment.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AddCommentDto } from '../../../src/http/blog/dto/add-comment.dto';

jest.mock('nestjs-typeorm-paginate');

describe('BlogService -> addComment', () => {
  let postRepository: Repository<PostEntity>;
  let commentRepository: Repository<CommentEntity>;
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
    commentRepository = module.get<Repository<CommentEntity>>(
      getRepositoryToken(CommentEntity),
    );
  });

  it('should add a comment to a post', async () => {
    const addCommentDto: AddCommentDto = {
      postId: 1,
      userId: 1,
      message: 'Test comment',
    };

    const foundPost = new PostEntity();
    foundPost.id = addCommentDto.postId;

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(foundPost);
    jest
      .spyOn(commentRepository, 'create')
      .mockReturnValue(addCommentDto as any);
    jest
      .spyOn(commentRepository, 'save')
      .mockResolvedValue(addCommentDto as any);

    const result = await blogService.addComment(addCommentDto);

    expect(result).toEqual(addCommentDto);
  });

  it('should throw a NotFoundException if post is not found', async () => {
    const addCommentDto: AddCommentDto = {
      postId: 1,
      userId: 1,
      message: 'Test comment',
    };

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

    await expect(blogService.addComment(addCommentDto)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should throw a BadRequestException if failed to add comment', async () => {
    const addCommentDto: AddCommentDto = {
      postId: 1,
      userId: 1,
      message: 'Test comment',
    };

    const error = new Error('Failed to add comment');
    jest.spyOn(postRepository, 'findOne').mockResolvedValue(new PostEntity());
    jest
      .spyOn(commentRepository, 'create')
      .mockReturnValue(addCommentDto as any);
    jest.spyOn(commentRepository, 'save').mockImplementation(() => {
      throw error;
    });

    await expect(blogService.addComment(addCommentDto)).rejects.toThrowError(
      BadRequestException,
    );
  });
});
