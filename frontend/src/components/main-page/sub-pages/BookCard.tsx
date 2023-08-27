import { useEffect, useState } from "react";
import { BookItem } from "./LibraryPage";
import * as bookApi from "../../../api/book";

const BookCard = (props: { book: BookItem }) => {
  const [coverImgUrl, setCoverImgUrl] = useState<string | undefined>();

  useEffect(() => {
    bookApi
      .cover(props.book.id)
      .then((cover) => URL.createObjectURL(cover))
      .then((coverUrl) => setCoverImgUrl(coverUrl));
  }, [props]);
  return (
    <div className="aspect-[4/3] rounded-md">
      <div className="bg-black">{coverImgUrl && <img src={coverImgUrl} />}</div>
      <div className="bg-red rounded-b-md">
        <h4>{props.book.title}</h4>
        <p>{props.book.author}</p>
      </div>
    </div>
  );
};

export default BookCard;
