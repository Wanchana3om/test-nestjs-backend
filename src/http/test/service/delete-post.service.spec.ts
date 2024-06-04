import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../../entities/post.entity';
import { BlogService } from '../../blog/blog.service';
import { CommentEntity } from '../../../entities/comment.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BlogService -> deletePost', () => {
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

  it('should delete a post by ID', async () => {
    const mockPost = {
      id: 1,
      title: 'Test Post',
      content: 'This is a test post',
      comments: [{ id: 1, message: 'Test comment', user: {} }],
      user: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost as any);
    jest.spyOn(commentRepository, 'remove').mockResolvedValue(undefined as any);
    jest.spyOn(postRepository, 'remove').mockResolvedValue(undefined as any);

    const postId = 1;
    await blogService.deletePost(postId);

    expect(postRepository.findOne).toHaveBeenCalledWith({
      where: { id: postId },
      relations: ['comments'],
    });
    expect(commentRepository.remove).toHaveBeenCalledWith(mockPost.comments);
    expect(postRepository.remove).toHaveBeenCalledWith(mockPost);
  });

  it('should throw a NotFoundException if post is not found', async () => {
    jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

    const postId = 1;
    await expect(blogService.deletePost(postId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw a BadRequestException if remove fails', async () => {
    const mockPost = {
      id: 1,
      title: 'Test Post',
      content: 'This is a test post',
      comments: [{ id: 1, message: 'Test comment', user: {} }],
      user: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost as any);
    jest.spyOn(commentRepository, 'remove').mockImplementation(() => {
      throw new Error('Failed to delete comments');
    });

    const postId = 1;
    await expect(blogService.deletePost(postId)).rejects.toThrow(
      BadRequestException,
    );
  });
});
