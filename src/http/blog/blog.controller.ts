import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Resource } from 'src/resource/resource';
import { AddCommentDto } from './dto/add-comment.dto';
import { EditPostDto } from './dto/edit-post.dto';
import { DeletePostDto } from './dto/delete-post.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('/')
  async getAllPost(@Query() query: any) {
    try {
      const response = await this.blogService.getAllPost(query);

      return Resource.successResponse(response);
    } catch (error) {
      return error;
    }
  }

  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    try {
      const response = await this.blogService.getPostById(id);

      return Resource.successResponse(response);
    } catch (error) {
      return error;
    }
  }

  @Post('post')
  async createPost(@Body() parameter: CreatePostDto) {
    try {
      const response = await this.blogService.createPost(parameter);

      return Resource.successResponse(response);
    } catch (error) {
      return error;
    }
  }

  @Patch('post')
  async editPost(@Body() parameter: EditPostDto) {
    try {
      const response = await this.blogService.editPost(parameter);

      return Resource.successResponse(response);
    } catch (error) {
      return error;
    }
  }

  @Delete('post')
  async deletePost(@Body() parameter: DeletePostDto) {
    try {
      const response = await this.blogService.deletePost(parameter.postId);

      return Resource.successResponse(response);
    } catch (error) {
      return error;
    }
  }

  @Post('comment')
  async addComment(@Body() parameter: AddCommentDto) {
    try {
      const response = await this.blogService.addComment(parameter);

      return Resource.successResponse(response);
    } catch (error) {
      return error;
    }
  }
}
