import { useEffect, useState } from "react";
import * as bookApi from "../../../api/book";
import BookCard from "./BookCard";

export interface BookItem {
  id: string;
  title: string;
  author: string;
}

const LibraryPage = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  useEffect(() => {
    bookApi
      .list()
      .then(async (res) => await res.json())
      .then((books) => setBooks(books));
  }, []);
  return (
    <>
      <div className="mt-4 mx-4 grid md:grid-cols-4 sm:grid-cols-2 gap-4">
        {books.map((book) => {
          return <BookCard key={book.id} book={book} />;
        })}
      </div>
    </>
  );
};

export default LibraryPage;
