import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { CommentEntity } from 'src/entities/comment.entity';
import { EditPostDto } from './dto/edit-post.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,

    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async getAllPost(parameters?: any): Promise<Pagination<PostEntity>> {
    const posts = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('comment.user', 'commentUser')
      .leftJoinAndSelect('post.user', 'user')
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('comment.createdAt', 'DESC');

    const page = Number(parameters.page) || 1;
    const perPage = Number(parameters.perPage) || 999;

    const options: IPaginationOptions = {
      page: page,
      limit: perPage,
    };

    return paginate<PostEntity>(posts, options);
  }

  async getOurPost(
    userId: number,
    parameters?: any,
  ): Promise<Pagination<PostEntity>> {
    const posts = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('comment.user', 'commentUser')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.userId = :userId', { userId })
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('comment.createdAt', 'DESC');

    const page = Number(parameters.page) || 1;
    const perPage = Number(parameters.perPage) || 999;

    const options: IPaginationOptions = {
      page: page,
      limit: perPage,
    };

    return paginate<PostEntity>(posts, options);
  }

  async getPostById(id: number): Promise<PostEntity> {
    const foundPost = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('comment.user', 'commentUser')
      .leftJoinAndSelect('post.user', 'user')
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('comment.id', 'DESC')
      .where('post.id = :id', { id: id })
      .getOne();

    return foundPost;
  }

  async addComment(parameter: AddCommentDto) {
    const { postId, userId, message } = parameter;

    const foundPost = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!foundPost) {
      throw new NotFoundException('Post not found');
    }

    try {
      const newComment = this.commentRepository.create({
        postId,
        message,
        userId,
      });

      const savedComment = await this.commentRepository.save(newComment);
      return savedComment;
    } catch (error) {
      throw new BadRequestException(`Failed to add comment: ${error.message}`);
    }
  }

  async editPost(parameter: EditPostDto) {
    const { postId, title, content, communityType } = parameter;

    const foundPost = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!foundPost) {
      throw new NotFoundException('Post not found');
    }

    try {
      foundPost.title = title;
      foundPost.communityType = communityType;
      foundPost.content = content;

      if (!title) {
        foundPost.title = title;
      }

      if (!communityType) {
        foundPost.communityType = communityType;
      }

      if (!content) {
        foundPost.content = content;
      }

      const updatedPost = await this.postRepository.save(foundPost);

      return updatedPost;
    } catch (error) {
      throw new BadRequestException(`Failed to update post: ${error.message}`);
    }
  }

  async deletePost(postId: number) {
    const foundPost = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['comments'],
    });

    if (!foundPost) {
      throw new NotFoundException('Post not found');
    }

    try {
      await this.commentRepository.remove(foundPost.comments);
      await this.postRepository.remove(foundPost);

      return;
    } catch (error) {
      throw new BadRequestException(`Failed to delete post: ${error.message}`);
    }
  }

  async createPost(parameter: CreatePostDto) {
    const { title, content, communityType, userId } = parameter;

    try {
      const newPost = this.postRepository.create({
        title,
        content,
        communityType,
        userId,
      });

      const savedPost = await this.postRepository.save(newPost);

      return savedPost;
    } catch (error) {
      throw new BadRequestException(`Failed to create post': ${error.message}`);
    }
  }
}
