import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CommentEntity } from 'src/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, CommentEntity])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
