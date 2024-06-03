import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { BlogController } from '../../blog/blog.controller';
import { BlogService } from '../../blog/blog.service';
import { AddCommentDto } from '../../blog/dto/add-comment.dto';
import { CommentEntity } from '../../../entities/comment.entity'; // Import your CommentEntity

describe('BlogController', () => {
  let controller: BlogController;
  let fakeBlogService: Partial<BlogService>;

  beforeEach(async () => {
    fakeBlogService = {
      addComment: jest.fn(),
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

  const addCommentDto: AddCommentDto = {
    postId: 1,
    userId: 1,
    message: 'Test comment',
  };

  const mockResult: CommentEntity = {
    id: 1,
    message: 'dsfsdfasfd',
    userId: 1,
    postId: 5,
    createdAt: new Date('2024-06-03T14:16:32.000Z'),
    updatedAt: new Date('2024-06-03T14:16:32.000Z'),
    post: null,
    user: null,
  };

  it('should return ok', async () => {
    jest.spyOn(fakeBlogService, 'addComment').mockResolvedValue(mockResult);
    const response = await controller.addComment(addCommentDto);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('should throw an exception', async () => {
    const error = new Error('error');
    jest.spyOn(fakeBlogService, 'addComment').mockRejectedValue(error);

    try {
      await controller.addComment(addCommentDto);
    } catch (error) {
      expect(error).toBe(error);
    }
  });
});
