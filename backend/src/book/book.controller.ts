import {
  Controller,
  FileValidator,
  HttpStatus,
  Injectable,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  // UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookService } from './book.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class BookValidor extends FileValidator {
  isValid<TFile extends IFile>(file?: TFile): boolean | Promise<boolean> {
    return (
      file.mimetype === 'application/octet-stream' &&
      file['originalname'] &&
      file['originalname'].split(/[. ]+/).pop() ===
        this.validationOptions['fileext']
    );
  }
  buildErrorMessage(): string {
    const ext = this.validationOptions['fileext'];
    return 'Not an ' + ext + ' file.';
  }
}

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          console.log(req.user);
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('upload')
  async uploadBook(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(new BookValidor({ fileext: 'epub' }))
        .addMaxSizeValidator({
          maxSize: 20000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    await this.bookService.saveBook(file);
  }
}
