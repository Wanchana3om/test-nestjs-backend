import { IsNotEmpty } from 'class-validator';

export class EditPostDto {
  @IsNotEmpty({
    message: 'post id is required',
  })
  postId: number;

  @IsNotEmpty({
    message: 'title is required',
  })
  title: string;

  @IsNotEmpty({
    message: 'content is required',
  })
  content: string;

  @IsNotEmpty({
    message: 'community type is required',
  })
  communityType: string;
}
