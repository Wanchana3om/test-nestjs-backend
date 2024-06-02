import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { CommentEntity } from './comment.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    name: 'username',
    type: 'varchar',
  })
  username: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
    onUpdate: 'CURRENT_TIMESTAMP(0)',
  })
  updatedAt: Date;

  @OneToMany(() => PostEntity, (post) => post.user)
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'user_id',
  })
  posts: PostEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'user_id',
  })
  comments: CommentEntity;
}
