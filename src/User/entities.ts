import {
      @IsString(),
@MaxLength(255),
@MinLength(1),
@IsEmail(),
@IsNumber(),
@IsNotEmpty(),
@Min(1)
     } from ../;

     import { ApiProperty } from '@nestjs/swagger';

      import { ApiProperty } from '@nestjs/swagger';export class User {
  @ApiProperty({required: false})
id: number;
  @ApiProperty({required: false})
email: string;
  @ApiProperty({required: false})
name: string;
  @ApiProperty({required: false})
password: string;
  @ApiProperty({required: false})
createdAt: Date;
  @ApiProperty({required: false})
attributes: any;
  @ApiProperty({required: false})
avatarUrl: string;
  @ApiProperty({required: false})
testId: number;
  @ApiProperty({required: false})
updatedAt: Date;
}

export class CreateUserDto {
@ApiProperty({required: true})
@IsString()
@MaxLength(255)
@MinLength(1)
@IsEmail()
  email: string;
@ApiProperty({required: false})
@IsString()
@MaxLength(255)
@MinLength(1)
  name: string;
@ApiProperty({required: true})
@IsString()
@MaxLength(255)
@MinLength(1)
  password: string;
@ApiProperty({required: false})
@Transform(({ value }) => safeParse(value))
  attributes: any;
@ApiProperty({required: false})
@IsString()
@MaxLength(255)
@MinLength(1)
  avatarUrl: string;
@ApiProperty({required: false})
@Transform(({ value }) => safeParse(value))
@IsNumber()
@IsNotEmpty()
@Min(1)
  testId: number;
}