function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const pageBlockSize = 10;

  const currentBlock = Math.floor((currentPage - 1) / pageBlockSize);
  const startPage = currentBlock * pageBlockSize + 1;
  const endPage = Math.min(startPage + pageBlockSize - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-container">
      <button
        className="pagination-button"
        onClick={() => onPageChange(startPage - 1)}
        disabled={startPage === 1}
      >
        &lt;&lt;
      </button>

      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      <ul className="pagination-list">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              className={`pagination-number-button ${currentPage === number ? "active" : ""}`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>

      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>

      <button
        className="pagination-button"
        onClick={() => onPageChange(endPage + 1)}
        disabled={endPage === totalPages}
      >
        &gt;&gt;
      </button>
    </nav>
  );
}

export default Pagination;
