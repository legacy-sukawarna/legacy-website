type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

interface PaginatedResponse<T> {
  results: T[];
  pagination: Pagination;
}
