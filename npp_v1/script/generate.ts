import * as fs from 'fs';
import config from './config';
import { lowerFirst } from './utils';

const getFile = (path: string) => {
  const data = fs.readFileSync(path, 'utf8');
  return data;
};
const getModal = (path: string) => {
  const regex = new RegExp(/model\s+\w+\s*\{([\s\S]*?)\s+\}\s+/g);
  const data = getFile(path);
  const enums = data.match(/(?<=\s*enum\s+)\w+(?=\s*\{)/g);
  console.log({ enums });
  const res = data?.match(regex).map((item) => {
    return {
      name: item.match(/model\s+(\w+)\s+\{/)[1],
      isFormdata: false,
      content: item
        .match(/\{([\s\S]*?)\s+\}\s+/)[1]
        ?.split('\n')
        .map((item) => item.trim())
        ?.filter((item) => item !== '' && !item?.startsWith('//'))
        ?.map((item) => {
          const [name, type, ...validation] = item.split(/\s+/);
          return {
            name,
            IsRequired:
              !type.endsWith('?') &&
              !validation.some((ele) => ele?.includes('@default')) &&
              !validation.some((ele) => ele?.includes('@updatedAt')),
            isPrimary: validation.some((ele) => ele?.includes('@id')),
            type: type.endsWith('?') ? type?.split('?')[0] : type,
            unique: validation?.some((ele) => ele?.includes('@unique')),
            validation: validation
              ?.filter(
                (ele) =>
                  !ele?.includes('@default') &&
                  !ele?.includes('@unique') &&
                  !ele?.includes('@id') &&
                  !ele?.includes('@db.') &&
                  !ele?.includes('@updatedAt'),
              )
              ?.map((ele) => ele.replace(/\//g, '').trim()),
          };
        }),
    };
  });
  res?.forEach((item) => {
    item.isFormdata = item?.content?.some((ele) =>
      ele.validation.some((ele) => ele?.includes('file')),
    );
  });
  return {
    res,
    enums,
  };
};

const genertateEntity = (item: any, enums: string[], models: string[]) => {
  const setValidation = new Set();
  let dto = '';
  let createDto = '';
  let updateDto = '';
  let enumdata = '';
  createDto += `export class Create${item.name}Dto extends OmitType(${item.name}Dto, [`;
  updateDto = `export class Update${item.name}Dto extends PartialType(Create${item.name}Dto) {}`;
  const isFormdata = item.isFormdata;
  dto += `export class ${item.name}Dto {\n`;
  item?.content?.forEach((ele) => {
    if (!models.includes(ele.type)) {
      dto += `@ApiProperty({required: ${ele.IsRequired} 
            ${
              enums.includes(ele.type) ? `, type: 'enum', enum:${ele.type}` : ''
            }})\n`;
      if (
        !ele.IsRequired ||
        ele.validation.some((dt) => dt.includes('file' || 'files'))
      )
        dto += `  @IsOptional()\n`;
      if (
        !(
          (ele.isPrimary && !ele.IsRequired) ||
          (ele.type === 'DateTime' && !ele.IsRequired)
        )
      ) {
        if (
          isFormdata &&
          config[ele.type]?.type !== 'string' &&
          config[ele.type]?.type !== 'string[]' &&
          !enums.includes(ele.type)
        ) {
          dto += `@Transform(({ value }) => safeParse(value))\n`;
        }
        for (let i = 0; i < config[ele.type]?.validation.length; i++) {
          setValidation.add(config[ele.type]?.validation[i]);
          dto += `${config[ele.type]?.validation[i]}\n`;
        }
        ele.validation
          ?.map((ele) => ele?.trim())
          ?.filter((ele) => /^\@[A-Z]\w+\(\w*\)$/.test(ele))
          ?.forEach((ele) => {
            setValidation.add(ele);
            dto += `${ele}\n`;
          });
      } else {
        createDto += `'${ele.name}', `;
      }
      if (enums.includes(ele.type)) {
        enumdata += (enumdata && ', ') + ele.type;
        dto += `@IsEnum(${ele.type})\n`;
      }
      dto += `  ${ele.name}: ${
        config[ele.type]?.type ||
        (enums.includes(ele.type) && ele.type) ||
        'any'
      };\n`;
    }
  });

  createDto += `]) {}\n`;
  dto += '}';

  return `import { ${[...setValidation]
    .map((ele: string) => ele.match(/\w+/)[0])
    .join(',\n')} ${
    item.content.some((cnt) => cnt.IsRequired) ? ', IsOptional' : ''
  }
      ${enumdata && ',IsEnum'} } from '@/utils/validation';\n  ${
    enumdata != '' && `import { ${enumdata} } from '@prisma/client';\n`
  } import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';\n
    ${
      item.isFormdata
        ? "import { safeParse } from '@/utils/function';\n import { Transform } from 'class-transformer';\n"
        : '\n'
    }\n ${dto}\n\n ${createDto}\n\n ${updateDto} `;
};

const generateModule = (ele: any) => {
  const dt = `import { Module } from '@nestjs/common';
    import { PrismaModule } from '@/prisma.module';
    import { ${ele.name}Service } from './${ele.name.toLowerCase()}.service';
    import { ${
      ele.name
    }Controller } from './${ele.name.toLowerCase()}.controller';
    
    @Module({
      controllers: [${ele.name}Controller],
      providers: [${ele.name}Service],
      imports: [PrismaModule],
    })
    export class ${ele.name}Module {}`;
  return dt;
};

const generateService = (ele: any) => {
  const name = lowerFirst(ele.name);
  const primaryKey =
    ele?.content?.filter((ele) => ele.isPrimary)[0].name || 'id';
  const dt = `import { Injectable } from '@nestjs/common';
    import { PrismaService } from 'src/prisma.service';
    import { Create${ele.name}Dto, Update${ele.name}Dto } from './entities';
    
    @Injectable()
    export class ${ele.name}Service {
      constructor(private prisma: PrismaService) {}
    
    async findAll(options?: any) {
      const [totalResult, results] = await Promise.all([
        this.prisma.${name}.count({ where: options.where }),
          this.prisma.${name}.findMany(options),
        ]);
        return { totalResult, results };
    }
    
    async findOne(${primaryKey}: number, query?: any) {
      return await this.prisma.${name}.findUnique({ where:{ ${primaryKey}},...query });
    }

    async create(data: Create${ele.name}Dto) {
      return await this.prisma.${name}.create({ data });
    }

    async update(${primaryKey}: number, data: Update${ele.name}Dto) {
      return await this.prisma.${name}.update({ where: { ${primaryKey} }, data });
    }
    
    async remove(${primaryKey}: number) {
      return await this.prisma.${name}.delete({ where: { ${primaryKey} } });
    }
    
    async removeAll() {
      return await this.prisma.${name}.deleteMany({
        where: {},
      });
    }

    async addMany(data: Create${ele.name}Dto[]) {
      return await this.prisma.${name}.createMany({ data });
    }
  }
    `;
  return dt;
};

const generateController = (ele: any) => {
  const filedFile = ele.content.find((res) =>
    res.validation.some((res) => res.includes('file' || 'files')),
  );
  const name = lowerFirst(ele.name);
  const primaryKey =
    ele?.content?.filter((ele) => ele.isPrimary)[0].name || 'id';
  const dt = `
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
      ${filedFile?.name ? 'UploadedFiles,' : ''}
      Query,
    } from '@nestjs/common';
    ${
      filedFile
        ? `import { File${
            filedFile?.validation.includes('files') ? 's' : ''
          }Interceptor } from '@nestjs/platform-express';\nimport { multerConfig } from '@/utils/multer';\n`
        : ''
    }
    import { ${ele.name}Service } from './${name}.service';
    import { ${ele.name}Dto, Create${ele.name}Dto, Update${
    ele.name
  }Dto } from './entities';
    import { NotFoundInterceptor } from '@/common/interceptors/notFound.interceptor';
    import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
    
    @ApiTags('${name}')
    @Controller('${name}')
    export class ${ele.name}Controller {
      constructor(private readonly ${name}Service: ${ele.name}Service) { }
    
      @ApiOkResponse({ type: [${ele.name}Dto] })
      @Get()
      findAll(@Query() query: any) {
        return this.${name}Service.findAll(query);
      }
  

      
      @UseInterceptors(NotFoundInterceptor) 
      @ApiOkResponse({ type: ${ele.name}Dto })
      @Get(':${primaryKey}')
      findOne(@Query() query: any, @Param('${primaryKey}', ParseIntPipe) ${primaryKey}: number) {
        return this.${name}Service.findOne(+${primaryKey}, query);
      }
  
      @ApiCreatedResponse({ type: ${ele.name}Dto })
      @Post()
      ${
        filedFile?.name
          ? `@UseInterceptors(File${
              filedFile?.validation.includes('files') ? 's' : ''
            }Interceptor('avatarUrl', 
          ${filedFile?.validation.includes('files') ? '20,' : ''}
          multerConfig))`
          : ''
      }
      create(${
        filedFile?.name ? '@UploadedFiles() files,' : ''
      } @Body() data: Create${ele.name}Dto) {
      
          ${
            filedFile?.name
              ? ` try{\n if (files){\n${
                  filedFile?.validation.includes('file')
                    ? `data['${filedFile?.name}'] = files.filename`
                    : filedFile?.validation.includes('files')
                    ? `data['${filedFile?.name}'] = files.map((file) => file.filename);\n}`
                    : ''
                }`
              : ''
          }
        return this.${name}Service.create(data);
        ${
          filedFile?.name
            ? `}\n catch(err){
              if (files){\n
          ${
            filedFile?.validation.includes('file')
              ? `multerConfig.storage._removeFile(null, files['${filedFile?.name}'][0].filename, () => {});`
              : filedFile?.validation.includes('files')
              ? `files['${filedFile?.name}'].forEach((file) => {
                multerConfig.storage._removeFile(null, file.filename, () => {});
                });
                \n}`
              : ''
          }
            throw err; }`
            : ''
        }
      }
   
      @ApiOkResponse({ type: ${ele.name}Dto })
      @Patch(':${primaryKey}')
      update(@Param('${primaryKey}', ParseIntPipe) ${primaryKey}: number, @Body() data: Update${
    ele.name
  }Dto) {
        return this.${name}Service.update(${primaryKey}, data);
      }
    
      @ApiOkResponse({ type: ${ele.name}Dto })
      @Delete(':${primaryKey}')
      remove(@Param('${primaryKey}', ParseIntPipe) ${primaryKey}: number) {
        return this.${name}Service.remove(${primaryKey});
      }
    
      @ApiOkResponse({ type: ${ele.name}Dto, isArray: true })
      @Post('/bulk')
      bulkCreate(@Body() data: Create${ele.name}Dto[]) {
        return this.${name}Service.addMany(data);
      }
      @ApiOkResponse({ type: ${ele.name}Dto, isArray: true })
      @Delete('/bulk/delete-all')
      bulkDelete() {
        return this.${name}Service.removeAll();
      }
    }
    `;
  return dt;
};
const main = () => {
  try {
    const data = getModal('prisma/schema.prisma');
    const res = data?.res || [];
    const enums = data.enums;
    const namesModal = res.map((item) => item.name);

    res.forEach((item) => {
      const entity = genertateEntity(item, enums, namesModal);
      const module = generateModule(item);
      const service = generateService(item);
      const controller = generateController(item);

      console.log(
        'entity-----------------------\n',
        entity,
        '---------------------\n',
      );
      console.log(
        'module-----------------------\n',
        module,
        '---------------------\n',
      );
      console.log(
        'service-----------------------\n',
        service,
        '---------------------\n',
      );
      console.log(
        'controller-----------------------\n',
        controller,
        '---------------------\n',
      );
    });
  } catch (error) {
    console.log(error);
  }
};

main();
