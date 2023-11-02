import React from "react";

export default function Pagination({
  pageNumbers,
  handlePageChange,
  currentPage,
}) {
  return (
    <div className="join">
      {Array.from({ length: pageNumbers }).map((_, index) => (
        <button
          key={index}
          className={`join-item btn btn-primary ${
            index + 1 === currentPage ? "btn-active" : ""
          }`}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}
