let data =
  "import { CacheModule, Module } from '@nestjs/common';\n" +
  "import { AppController } from './app.controller';\n" +
  "import { AppService } from './app.service';\n" +
  "import { APP_FILTER } from '@nestjs/core';\n" +
  "\n" +
  "import { join } from 'path';\n" +
  "import { MulterModule } from '@nestjs/platform-express/multer';\n" +
  "import { ServeStaticModule } from '@nestjs/serve-static';\n" +
  "import { PrismaModule } from './prisma.module';\n" +
  "import { AllExceptionsFilter } from './utils/prisma-client-exception-filter';\n" +
  "\n" +
  "@Module({\n" +
  "  imports: [\n" +
  "    CacheModule.register(),\n" +
  "    MulterModule.register({\n" +
  "      dest: join(__dirname, '..', '..', 'uploads'),\n" +
  "    }),\n" +
  "    // CacheModule.register(),\n" +
  "    ServeStaticModule.forRoot({\n" +
  "      rootPath: join(__dirname, '..', '..', 'uploads'),\n" +
  "      serveRoot: '/uploads',\n" +
  "    }),\n" +
  "    PrismaModule,\n" +
  "  ],\n" +
  "  controllers: [AppController],\n" +
  "  providers: [\n" +
  "    {\n" +
  "      provide: APP_FILTER,\n" +
  "      useClass: AllExceptionsFilter,\n" +
  "    },\n" +
  "    AppService,\n" +
  "  ],\n" +
  "})\n" +
  "export class AppModule {}";

console.log(data.replace("imports", "||||||"));
console.log(data);
