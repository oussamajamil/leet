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

      falseexport class Test {
  @ApiProperty({required: false})
id: number;
  @ApiProperty({required: false})
name: string;
  @ApiProperty({required: false})
createdAt: Date;
  @ApiProperty({required: false})
updatedAt: Date;
}

export class CreateTestDto {
@ApiProperty({required: true})
@IsString()
@MaxLength(255)
@MinLength(1)
  name: string;
}