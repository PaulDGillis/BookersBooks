import { Book, User } from '@prisma/client';

export type FindBookResponse = Book | null;

export type ListBookData = Omit<Book, 'name' | 'img' | 'userId'>[];
export type BookMetaData = Pick<Book, 'id' | 'title' | 'author'>;
export type EpubMetaData = Pick<Book, 'title' | 'author' | 'img'> & {
  blob: Blob;
};

export type UserData = Omit<User, 'password'>;
