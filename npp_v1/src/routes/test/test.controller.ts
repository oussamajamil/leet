
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
      
      Query,
    } from '@nestjs/common';
    
    import { TestService } from './test.service';
    import { TestDto, CreateTestDto, UpdateTestDto } from './entities';
    import { NotFoundInterceptor } from '@/common/interceptors/notFound.interceptor';
    import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
    
    @ApiTags('test')
    @Controller('test')
    export class TestController {
      constructor(private readonly testService: TestService) { }
    
      @ApiOkResponse({ type: [TestDto] })
      @Get()
      findAll(@Query() query: any) {
        return this.testService.findAll(query);
      }
      @UseInterceptors(NotFoundInterceptor) 
      @ApiOkResponse({ type: TestDto })
      @Get(':id')
      findOne(@Query() query: any, @Param('id', ParseIntPipe) id: number) {
        return this.testService.findOne(id, query);
      }
  
      @ApiCreatedResponse({ type: TestDto })
      @Post()
      
       create( @Body() data: CreateTestDto) {
      
          
        return    this.testService.create(data);
        
      }
   
   
      @ApiOkResponse({ type: TestDto })
      @Patch(':id')
      update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateTestDto) {
        return this.testService.update(id, data);
      }
    
      @ApiOkResponse({ type: TestDto })
      @Delete(':id')
      remove(@Param('id', ParseIntPipe) id: number) {
        return this.testService.remove(id);
      }
    
      @ApiOkResponse({ type: TestDto, isArray: true })
      @Post('/bulk')
      bulkCreate(@Body() data: CreateTestDto[]) {
        return this.testService.addMany(data);
      }
      @ApiOkResponse({ type: TestDto, isArray: true })
      @Delete('/bulk/delete-all')
      bulkDelete() {
        return this.testService.removeAll();
      }
    }
    