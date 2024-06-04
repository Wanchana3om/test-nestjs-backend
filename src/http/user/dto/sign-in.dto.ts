import { IsNotEmpty } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class SignInDto {
  @Trim()
  @IsNotEmpty({
    message: 'username is required',
  })
  username: string;
}
