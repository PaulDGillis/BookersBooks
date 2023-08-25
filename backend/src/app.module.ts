import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LocalStrategy } from './auth/local.strategy';
import { BookModule } from './book/book.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [AuthModule, PrismaModule, BookModule, StorageModule],
  controllers: [AppController],
  providers: [AppService, LocalStrategy],
})
export class AppModule {}
