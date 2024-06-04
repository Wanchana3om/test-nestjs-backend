import { IsNotEmpty } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty({
    message: 'user id is required',
  })
  userId: number;

  @IsNotEmpty({
    message: 'post id is required',
  })
  postId: number;

  @IsNotEmpty({
    message: 'message is required',
  })
  message: string;
}
