type Book = {
  id: number;
  title: string;
  author: string;
  img: string;
  name: string;
  userId: string;
};

type FindBookResponse = Book | null;

type ListBookData = Omit<Book, "name" | "img" | "userId">[];
type BookMetaData = Pick<Book, "id" | "title" | "author">;
type EpubMetaData = Pick<Book, "title" | "author" | "img"> & {
  blob: Blob;
};

type User = {
  id: number;
  username: string;
  password: string;
};

type UserData = Omit<User, "password">;
type MaybeUserData = Omit<User, "id">;

export {
  Book,
  FindBookResponse,
  ListBookData,
  BookMetaData,
  EpubMetaData,
  User,
  UserData,
  MaybeUserData,
};
