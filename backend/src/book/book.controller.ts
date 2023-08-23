import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookService } from './book.service';
import { diskStorage } from 'multer';
import { extname, join as pathJoin } from 'path';
import { existsSync as fsExistsSync, mkdirSync as fsMkdirSync } from 'fs';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, _file, cb) => {
          const userName = req.user['username'];
          const destPath = pathJoin('uploads', userName);
          if (!fsExistsSync(destPath)) {
            fsMkdirSync(destPath);
          }
          cb(null, destPath);
        },
        filename: (_req, file, cb) => cb(null, file.originalname),
      }),
      fileFilter: (_req, file, callback) => {
        callback(null, extname(file.originalname) === '.epub');
      },
    }),
  )
  @Post('upload')
  async uploadBook(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 20000000 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    await this.bookService.saveBook(file);
  }
}
