import { IsEmail, IsString, Length } from 'class-validator';

export class SignupDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 72) // bcrypt silently truncates beyond 72 bytes - cap it here
  password: string;
}
