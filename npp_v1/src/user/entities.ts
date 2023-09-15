import {
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  IsArray,
  IsNumber,
  IsNotEmpty,
  Min,
  IsOptional,
  IsEnum,
} from '@/utils/validation';

import { Role, Role2 } from '@prisma/client';

import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

import { safeParse } from '@/utils/function';
import { Transform } from 'class-transformer';

export class UserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  userId: number;
  @ApiProperty({ required: true })
  @Transform(({ value }) => safeParse(value))
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  @IsEmail()
  email: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => safeParse(value))
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  name: string;
  @ApiProperty({ required: true })
  @Transform(({ value }) => safeParse(value))
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  password: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => safeParse(value))
  attributes: any;
  @ApiProperty({ required: false, type: 'enum', enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role: Role;
  @ApiProperty({ required: false, type: 'enum', enum: Role2 })
  @IsOptional()
  @IsEnum(Role2)
  role2: Role2;
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => safeParse(value))
  @IsArray()
  avatarUrl: string[];
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => safeParse(value))
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  testId: number;
}

export class CreateUserDto extends OmitType(UserDto, ['userId']) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
