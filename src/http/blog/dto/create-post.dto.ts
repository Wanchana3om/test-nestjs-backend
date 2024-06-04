import { IsNotEmpty } from 'class-validator';
import { CommunityTypeEnum } from '../../../entities/community-type-enum';

export class CreatePostDto {
  @IsNotEmpty({
    message: 'user id is required',
  })
  userId: number;

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
  communityType: CommunityTypeEnum;
}
