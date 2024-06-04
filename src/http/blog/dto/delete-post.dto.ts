import { IsNotEmpty } from 'class-validator';

export class DeletePostDto {
  @IsNotEmpty({
    message: 'post id is required',
  })
  postId: number;
}
