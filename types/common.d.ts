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

type MonthlyAttendance = {
  month: string;
  groupsWithAttendance: number;
  attendancePercentage: number;
  groups: any[];
};

type AttendanceReport = {
  start_date: string;
  end_date: string;
  totalGroups: number;
  monthlyAttendance: MonthlyAttendance[];
};
