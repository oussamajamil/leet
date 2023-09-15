import {
    IsString,
MaxLength,
MinLength
    , IsOptional
    ,IsEnum
   } from '@/utils/validation';

    import { Role, Role2 } from '@prisma/client';

   import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

   
    

export class TestDto {
@ApiProperty({required: false 
            })
  @IsOptional()
  id: number;
@ApiProperty({required: true 
            })
@IsString()
@MaxLength(255)
@MinLength(1)
  name: string;
@ApiProperty({required: false 
            })
  @IsOptional()
  createdAt: Date;
@ApiProperty({required: false 
            })
  @IsOptional()
  updatedAt: Date;
}

export class CreateTestDto extends OmitType(TestDto, ['id', 'createdAt', 'updatedAt', ]) {}


export class UpdateTestDto extends PartialType(CreateTestDto) {}