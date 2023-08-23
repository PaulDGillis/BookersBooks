import { Injectable } from '@nestjs/common';
import { readFileSync as fsReadFileSync } from 'fs';
import {
  configure,
  ZipReader,
  BlobReader,
  TextWriter,
  BlobWriter,
} from '@zip.js/zip.js';
import { EPUB } from 'foliate-js/EPUB';

// function toArrayBuffer(buffer: Buffer) {
//   return buffer.buffer.slice(
//     buffer.byteOffset,
//     buffer.byteOffset + buffer.byteLength,
//   );
// }

const makeZipLoader = async (file) => {
  configure({ useWebWorkers: false });
  const reader = new ZipReader(new BlobReader(file));
  const entries = await reader.getEntries();
  const map = new Map(entries.map((entry) => [entry.filename, entry]));
  const load =
    (f) =>
    (name, ...args) =>
      map.has(name) ? f(map.get(name), ...args) : null;
  const loadText = load((entry) => entry.getData(new TextWriter()));
  const loadBlob = load((entry, type) => entry.getData(new BlobWriter(type)));
  const getSize = (name) => map.get(name)?.uncompressedSize ?? 0;
  return { entries, loadText, loadBlob, getSize };
};

const isZip = async (file: Buffer) => {
  const arr = new Uint8Array(await file.slice(0, 4));
  return (
    arr[0] === 0x50 && arr[1] === 0x4b && arr[2] === 0x03 && arr[3] === 0x04
  );
};

@Injectable()
export class BookService {
  async saveBook(file: Express.Multer.File) {
    const buff = fsReadFileSync(file.path, null);
    const yoZip = await isZip(buff);
    console.log(yoZip);
    const zipLoader = makeZipLoader(buff);
    const book = await new EPUB(zipLoader).init();
    console.log(book);
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
