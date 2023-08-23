import { Injectable } from '@nestjs/common';

function toArrayBuffer(buffer) {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
}

@Injectable()
export class BookService {
  async saveBook(file: Express.Multer.File) {
    // const arrayBuff = toArrayBuffer(file.buffer);
    // const book = ePub(arrayBuff);
    // await Promise.all([book.loaded.metadata, book.coverUrl()]).then(
    //   ([metadata, coverUrl]) => {
    //     console.log(metadata);
    //     console.log(coverUrl);
    //   },
    // );
    // console.log(book);
    console.log(file);
  }
}
