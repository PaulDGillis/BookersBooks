import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageFile } from 'src/storage/storage-file';
import { StorageService } from 'src/storage/storage.service';

import { EpubService } from './epub.service';
import { join } from 'path';
import { BookMetaData, FindBookResponse, ListBookData } from 'src/types';

@Injectable()
export class BookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
    private readonly epubService: EpubService,
  ) {}

  saveBook = async (
    username: string,
    file: Express.Multer.File,
  ): Promise<BookMetaData> => {
    const fileBlob = new Blob([file.buffer]);
    const {
      title,
      author,
      img: imgName,
      blob,
    } = await this.epubService.parseEpub(fileBlob);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { img, name, userId, ...book } = await this.prismaService.book.create(
      {
        data: {
          userId: username,
          name: file.originalname,
          img: imgName,
          title,
          author,
        },
      },
    );

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

    return book;
  };

  deleteBook = async (username: string, bookId: string): Promise<void> => {
    const book = await this.prismaService.book.delete({
      where: { userId: username, id: parseInt(bookId) },
    });

    await this.storageService.delete(join(username, bookId, book.img));
    await this.storageService.delete(join(username, bookId, book.name));
  };

  listBooks = async (username: string): Promise<ListBookData> => {
    const books = (
      await this.prismaService.book.findMany({
        where: { userId: username },
        orderBy: { title: 'asc' },
      })
    ).map((book) => {
      return { id: book.id, title: book.title, author: book.author };
    });
    return books;
  };

  findBook = async (
    username: string,
    bookId: string,
  ): Promise<FindBookResponse> => {
    return this.prismaService.book.findUnique({
      where: {
        id: parseInt(bookId),
        userId: username,
      },
    });
  };

  downloadBook = async (
    username: string,
    bookId: string,
  ): Promise<StorageFile> => {
    const book = await this.findBook(username, bookId);
    let storageFile: StorageFile;
    try {
      storageFile = await this.storageService.get(
        username + '/' + book.id + '/' + book.name,
      );
    } catch (e) {
      if (e.message.toString().includes('No such object')) {
        console.log(e);
        throw new NotFoundException('book not found');
      } else {
        throw new ServiceUnavailableException('internal error');
      }
    }
    return storageFile;
  };

  downloadCover = async (
    username: string,
    bookId: string,
  ): Promise<StorageFile> => {
    const book = await this.findBook(username, bookId);
    let storageFile: StorageFile;
    try {
      storageFile = await this.storageService.get(
        username + '/' + book.id + '/' + book.img,
      );
    } catch (e) {
      if (e.message.toString().includes('No such object')) {
        console.log(e);
        throw new NotFoundException('cover not found');
      } else {
        throw new ServiceUnavailableException('internal error');
      }
    }
    return storageFile;
  };

  downloadMetadata = async (
    username: string,
    bookId: string,
  ): Promise<BookMetaData> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { img, name, userId, ...book } = await this.findBook(
      username,
      bookId,
    );
    return book;
  };
}
