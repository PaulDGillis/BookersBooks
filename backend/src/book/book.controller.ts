import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookService } from './book.service';
import { extname } from 'path';
import { Response } from 'express';
import { Username } from 'src/auth/user.decorator';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, callback) => {
        callback(null, extname(file.originalname) === '.epub');
      },
    }),
  )
  @Post('upload')
  async uploadBook(
    @Username() username: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 20000000 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    await this.bookService.saveBook(username, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async listBooks(@Username() username) {
    return await this.bookService.listBooks(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':bookId/book')
  async downloadBook(
    @Param('bookId') bookId: string,
    @Username() username: string,
    @Res() res: Response,
  ) {
    const storageFile = await this.bookService.downloadBook(username, bookId);

    res.setHeader('Content-Type', storageFile.contentType);
    res.setHeader('Cache-Control', 'max-age=60d');
    res.end(storageFile.buffer);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':bookId/cover')
  async downloadCover(
    @Param('bookId') bookId: string,
    @Username() username: string,
    @Res() res: Response,
  ) {
    const storageFile = await this.bookService.downloadCover(username, bookId);

    res.setHeader('Content-Type', storageFile.contentType);
    res.setHeader('Cache-Control', 'max-age=60d');
    res.end(storageFile.buffer);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':bookId/metadata')
  async downloadMetadata(
    @Param('bookId') bookId: string,
    @Username() username: string,
  ) {
    return this.bookService.downloadMetadata(username, bookId);
  }
}
