type Absence = {
  id: number;
  date: Date;
  notes: string;
  photo_url: string;
  created_at: Date;
  updated_at: Date;
  group: {
    name: string;
    id: string;
    mentor: {
      name: string;
    };
  };
};

type AbsenceResponse = {
  records: Absence[];
  pagination: Pagination;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
