export type StandardSubject = {
  standardSubjectId: number;
  subjectTypeTitle: string;
  title: string;
  standardDto: {
    standardId: number;
    standard: string;
  };
  subjectDto: {
    subjectId: number;
    subjectName: string;
  };
};
