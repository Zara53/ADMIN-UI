import React from "react";
import styles from "./Pagination.module.css";

const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  paginate,
  handleDeleteSelected,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.pagination}>
      <div>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? styles.active : ""}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
        >
          Next
        </button>
      </div>
      <div>
        <button onClick={handleDeleteSelected}>Delete Selected</button>
      </div>
    </div>
  );
};

export default Pagination;
