import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageFile } from 'src/storage/storage-file';
import { StorageService } from 'src/storage/storage.service';

import { EpubService } from './epub.service';

@Injectable()
export class BookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
    private readonly epubService: EpubService,
  ) {}

  async saveBook(username: string, file: Express.Multer.File) {
    const fileBlob = new Blob([file.buffer]);
    const {
      title,
      author,
      img: { blob, name },
    } = await this.epubService.parseEpub(fileBlob);

    const book = await this.prismaService.book.create({
      data: {
        userId: username,
        name: file.originalname,
        img: name,
        title,
        author,
      },
    });

    await this.storageService.save(
      username + '/' + book.id + '/' + file.originalname,
      file.mimetype,
      file.buffer,
      [{ bookId: book.id.toString() }],
    );

    await this.storageService.save(
      username + '/' + book.id + '/' + name,
      blob.type,
      Buffer.from(await blob.arrayBuffer()),
      [{ bookId: book.id.toString() }],
    );
  }

  async listBooks(username: string) {
    return this.storageService.list(username);
  }

  async findBook(username: string, bookId: string) {
    const book = await this.prismaService.book.findUnique({
      where: { id: parseInt(bookId) },
    });

    console.log(book);

    let storageFile: StorageFile;
    try {
      storageFile = await this.storageService.get(username + '/' + book.name);
    } catch (e) {
      if (e.message.toString().includes('No such object')) {
        throw new NotFoundException('book not found');
      } else {
        throw new ServiceUnavailableException('internal error');
      }
    }
    return storageFile;
  }
}
