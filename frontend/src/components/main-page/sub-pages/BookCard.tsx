import { BookItem } from "./LibraryPage";
import * as bookApi from "../../../api/book";

const BookCard = (props: { book: BookItem }) => {
  const coverImgUrl = bookApi.cover(props.book.id);
  return (
    <div className="rounded-xl grow shadow-lg bg-neutral-200 flex flex-row items-center">
      <img
        className="rounded-l-lg w-16 md:w-32 lg:w-48 h-auto"
        src={coverImgUrl}
      />
      <div className="m-2 min-w-4 flex flex-col items-start">
        <div className="text-md font-medium text-black line-clamp-1 text-ellipsis overflow-hidden">
          {props.book.title}
        </div>
        <div className="text-slate-500">{props.book.author}</div>
      </div>
    </div>
  );
};

export default BookCard;
