export type Exam = {
  examId: string;
  minMarks: number;
  maxMarks: number;
  examDate: string;
  examDuration: string;
  examTypeDto: {
    examNameTitle: string;
    schoolId: number;
  };
  standardSubjectDto: {
    subjectDto: {
      subjectName: string;
    };
    standardDto: {
      title: string;
      section: string;
    };
  };
  status: string;
};
