import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../../entities/post.entity';
import { BlogService } from '../../blog/blog.service';
import { CommentEntity } from '../../../entities/comment.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EditPostDto } from '../../blog/dto/edit-post.dto';
import { CommunityTypeEnum } from '../../../entities/community-type-enum';

jest.mock('nestjs-typeorm-paginate');

describe('BlogService -> editPost', () => {
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

  it('should update a post', async () => {
    const editPostDto: EditPostDto = {
      postId: 1,
      title: 'Updated Test Post',
      content: 'This is an updated test post',
      communityType: CommunityTypeEnum.EXERCISE,
    };

    const foundPost = new PostEntity();
    foundPost.id = editPostDto.postId;
    foundPost.title = 'Test Post';
    foundPost.content = 'This is a test post';
    foundPost.communityType = CommunityTypeEnum.EXERCISE;

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(foundPost);
    jest.spyOn(postRepository, 'save').mockResolvedValue(foundPost);

    const result = await blogService.editPost(editPostDto);

    expect(result).toEqual(foundPost);
    expect(result.title).toEqual(editPostDto.title);
    expect(result.content).toEqual(editPostDto.content);
    expect(result.communityType).toEqual(editPostDto.communityType);
  });

  it('should throw a NotFoundException if post is not found', async () => {
    const editPostDto: EditPostDto = {
      postId: 1,
      title: 'Updated Test Post',
      content: 'This is an updated test post',
      communityType: CommunityTypeEnum.EXERCISE,
    };

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

    await expect(blogService.editPost(editPostDto)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should throw a BadRequestException if failed to update post', async () => {
    const editPostDto: EditPostDto = {
      postId: 1,
      title: 'Updated Test Post',
      content: 'This is an updated test post',
      communityType: CommunityTypeEnum.EXERCISE,
    };

    const error = new Error('Failed to update post');
    jest.spyOn(postRepository, 'findOne').mockResolvedValue(new PostEntity());
    jest.spyOn(postRepository, 'save').mockImplementation(() => {
      throw error;
    });

    await expect(blogService.editPost(editPostDto)).rejects.toThrowError(
      BadRequestException,
    );
  });
});
