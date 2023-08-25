import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { StorageModule } from 'src/storage/storage.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EpubService } from './epub.service';

@Module({
  imports: [PrismaModule, StorageModule],
  providers: [BookService, EpubService],
  controllers: [BookController],
})
export class BookModule {}
