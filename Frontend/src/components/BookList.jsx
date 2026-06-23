import BookItem from "./BookItem";
import { useState } from "react";
import Pagination from "./Pagination";

function BookList({ books }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const sortedBooks = [...books].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBooks.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <ul className="book-list">
        {currentItems.map((book) => (
          <BookItem
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            content={book.content}
            coverImageUrl={book.coverImageUrl}
            createdAt={book.createdAt}
            updatedAt={book.updatedAt}
            tags={book.genres ? [...new Set(book.genres.flatMap(g => [g.mainTag, g.subTag]))] : []}
          />
        ))}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalItems={sortedBooks.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default BookList;
