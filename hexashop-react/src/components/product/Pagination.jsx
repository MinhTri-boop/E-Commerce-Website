const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="col-lg-12">
      <div className="pagination">
        <ul>
          {currentPage > 1 && (
            <li>
              <button onClick={() => onPageChange(currentPage - 1)}>&lt;</button>
            </li>
          )}
          
          {pages.map(page => (
            <li key={page} className={currentPage === page ? 'active' : ''}>
              <button onClick={() => onPageChange(page)}>{page}</button>
            </li>
          ))}

          {currentPage < totalPages && (
            <li>
              <button onClick={() => onPageChange(currentPage + 1)}>&gt;</button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
