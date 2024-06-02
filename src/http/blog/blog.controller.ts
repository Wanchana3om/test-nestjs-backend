import { Controller, Post, Body, Patch } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Resource } from 'src/resource/resource';
import { AddCommentDto } from './dto/add-comment.dto';
import { EditPostDto } from './dto/edit-post.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create-post')
  async createPost(@Body() parameter: CreatePostDto) {
    try {
      const response = await this.blogService.createPost(parameter);

      return Resource.successResponse(response);
    } catch (error) {
      return error;
    }
  }

  @Patch('edit-post')
  async editPost(@Body() parameter: EditPostDto) {
    try {
      const response = await this.blogService.editPost(parameter);

      return Resource.successResponse(response);
    } catch (error) {
      return error;
    }
  }

  @Post('add-comment')
  async addComment(@Body() parameter: AddCommentDto) {
    try {
      const response = await this.blogService.addComment(parameter);

      return Resource.successResponse(response);
    } catch (error) {
      return error;
    }
  }
}
