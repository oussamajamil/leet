import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';

import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express/multer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaModule } from './prisma.module';
import { AllExceptionsFilter } from './utils/prisma-client-exception-filter';

@Module({
  imports: [
    CacheModule.register(),
    MulterModule.register({
      dest: join(__dirname, '..', '..', 'uploads'),
    }),
    CacheModule.register(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
  ],
})
export class AppModule {}
