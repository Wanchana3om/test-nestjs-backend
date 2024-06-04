import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { BlogController } from '../../blog/blog.controller';
import { BlogService } from '../../blog/blog.service';
import { DeletePostDto } from '../../blog/dto/delete-post.dto';

describe('BlogController', () => {
  let controller: BlogController;
  let fakeBlogService: Partial<BlogService>;

  beforeEach(async () => {
    fakeBlogService = {
      deletePost: jest.fn(),
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

  const deletePostDto: DeletePostDto = {
    postId: 1,
  };

  it('should return ok', async () => {
    jest.spyOn(fakeBlogService, 'deletePost').mockResolvedValue();
    const response = await controller.deletePost(deletePostDto);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('should throw an exception', async () => {
    const error = new Error('error');
    jest.spyOn(fakeBlogService, 'deletePost').mockRejectedValue(error);

    try {
      await controller.deletePost(deletePostDto);
    } catch (error) {
      expect(error).toBe(error);
    }
  });
});
