
    import {
      Controller,
      Get,
      Post,
      Body,
      Patch,
      Param,
      Delete,
      ParseIntPipe,
      UseInterceptors,
      UploadedFile,
      Query,
    } from '@nestjs/common';
    import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '@/utils/multer';

    import { UserService } from './user.service';
    import { UserDto, CreateUserDto, UpdateUserDto } from './entities';
    import { NotFoundInterceptor } from '@/common/interceptors/notFound.interceptor';
    import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
    
    @ApiTags('user')
    @Controller('user')
    export class UserController {
      constructor(private readonly userService: UserService) { }
    
      @ApiOkResponse({ type: [UserDto] })
      @Get()
      findAll(@Query() query: any) {
        return this.userService.findAll(query);
      }
      @UseInterceptors(NotFoundInterceptor) 
      @ApiOkResponse({ type: UserDto })
      @Get(':userId')
      findOne(@Query() query: any, @Param('userId', ParseIntPipe) userId: number) {
        return this.userService.findOne(userId, query);
      }
  
      @ApiCreatedResponse({ type: UserDto })
      @Post()
      @UseInterceptors(FileInterceptor('avatarUrl', 
          
          multerConfig))
      async create(@UploadedFile() files, @Body() data: CreateUserDto) {
      
           try{
 if (files)
data['avatarUrl'] = files.filename
        return  await  this.userService.create(data);
        }
 catch(err){
              if (files){

          multerConfig.storage._removeFile(null, files, () => {});
            }
            throw err;}
      }
   
   
      @ApiOkResponse({ type: UserDto })
      @Patch(':userId')
      update(@Param('userId', ParseIntPipe) userId: number, @Body() data: UpdateUserDto) {
        return this.userService.update(userId, data);
      }
    
      @ApiOkResponse({ type: UserDto })
      @Delete(':userId')
      remove(@Param('userId', ParseIntPipe) userId: number) {
        return this.userService.remove(userId);
      }
    
      @ApiOkResponse({ type: UserDto, isArray: true })
      @Post('/bulk')
      bulkCreate(@Body() data: CreateUserDto[]) {
        return this.userService.addMany(data);
      }
      @ApiOkResponse({ type: UserDto, isArray: true })
      @Delete('/bulk/delete-all')
      bulkDelete() {
        return this.userService.removeAll();
      }
    }
    