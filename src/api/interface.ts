export interface Tool {
  tool_id: number;
  tool_name: string;
  service_id: string;
  assign_to: string;
  tool_slug: string;
  customized_name: string | null;
  label: string;
  customized_description: string | null;
  additional_instruction: string | null;
  tool_description: string;
  tool_thumbnail: string | null;
}
export interface ClassroomResource {
  resources_id: number;
  classroom_path: string;
  file_content: string;
}

export interface Classroom {
  classroom_id: number;
  classroom_name: string;
  classroom_description: string;
  grade: string;
  status: string;
  class_intro: string;
  number_of_students: number;
  number_of_students_joined: number;
  scope_restriction: boolean;
  classroom_thumbnail: string | null;
  join_url: string;
  join_code: string;
  author: string;
  tools: Tool[];
  classroomresources: ClassroomResource[];
  resources: any[];
}
export interface ClassroomData {
  id: number;
  name: string;
  description: string;
  join_url: string;
  join_code: string;
  thumbnail: string | null;
}
export interface Student {
  student_id: number;
  name: string;
  grade: string;
  status: "joined";
  profile_image: string;
  submission_status: string;
  last_join: string;
  firstname: string;
  lastname: string;
  classroom_id: number;
}

export interface Question {
  assignmentquestion_id: number;
  assignment_question: string;
  assignment_answer: string | null;
  question_type: string | null;
}

export interface Assignment {
  assignment_id: number;
  assignment_name: string;
  assignment_description: string;
  grade: string;
  status: string;
  assignment_intro: string;
  join_url: string;
  number_of_students: number;
  join_code: string;
  classroom_id: number | null;
  submission_status: string;
  classroom_name: string | null;
  number_of_students_completed: number;
  assignment_thumbnail: string | null;
  thumbnail: string | null;
  submit_url: string;
  submission_code: string;
  author: string;
  questions: Question[];
}

export interface AssignmentData {
  id: number;
  assignmentTitle: string;
  content: string;
  submissionDate: string;
  studentId: number;
}
