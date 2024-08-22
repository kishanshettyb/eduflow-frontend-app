import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (pageNumber: number) => void;
};

function CustomPagination({ currentPage, pageSize, totalItems, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  return (
    <div className="flex justify-center my-10">
      <div className="w-1/4">
        <Pagination className="flex justify-center">
          <PaginationPrevious
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PaginationPrevious>
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem
                key={index}
                onClick={() => handlePageClick(index + 1)}
                isActive={index + 1 === currentPage}
              >
                <PaginationLink href={`#${index + 1}`} isActive={index + 1 === currentPage}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <PaginationNext
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationNext>
        </Pagination>
      </div>
    </div>
  );
}

export default CustomPagination;
