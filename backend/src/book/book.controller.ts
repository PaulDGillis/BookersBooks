import {
  Controller,
  Delete,
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
import { BookMetaData, ListBookData } from 'bookers-books';

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
  ): Promise<BookMetaData> {
    return await this.bookService.saveBook(username, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async listBooks(@Username() username): Promise<ListBookData> {
    return await this.bookService.listBooks(username);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':bookId')
  async deleteBook(
    @Param('bookId') bookId: string,
    @Username() username: string,
  ): Promise<void> {
    await this.bookService.deleteBook(username, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':bookId/book')
  async downloadBook(
    @Param('bookId') bookId: string,
    @Username() username: string,
    @Res() res: Response,
  ): Promise<void> {
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
  ): Promise<void> {
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
  ): Promise<BookMetaData> {
    return this.bookService.downloadMetadata(username, bookId);
  }
}
