import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { BlogController } from '../../blog/blog.controller';
import { BlogService } from '../../blog/blog.service';
import { EditPostDto } from '../../blog/dto/edit-post.dto';
import { PostEntity } from '../../../entities/post.entity';
import { CommunityTypeEnum } from '../../../entities/community-type-enum';

describe('BlogController', () => {
  let controller: BlogController;
  let fakeBlogService: Partial<BlogService>;

  beforeEach(async () => {
    fakeBlogService = {
      editPost: jest.fn(),
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

  const editedPost: PostEntity = {
    id: 1,
    title: 'Updated Title',
    content: 'Updated Content',
    communityType: CommunityTypeEnum.FASHION,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: null,
    user: null,
  };

  const editPostDto: EditPostDto = {
    postId: 1,
    title: 'Updated Title',
    content: 'Updated Content',
    communityType: CommunityTypeEnum.FASHION,
  };

  it('should return ok', async () => {
    jest.spyOn(fakeBlogService, 'editPost').mockResolvedValue(editedPost);
    const response = await controller.editPost(editPostDto);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('should throw an exception', async () => {
    const error = new Error('error');
    jest.spyOn(fakeBlogService, 'editPost').mockRejectedValue(error);

    try {
      await controller.editPost(editPostDto);
    } catch (error) {
      expect(error).toBe(error);
    }
  });
});
