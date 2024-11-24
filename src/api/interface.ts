export interface Tool {
  tool_id: number;
  tool_name: string;
  service_id: string;
  assign_to: string;
  slug: string;
  customized_name: string | null;
  customized_description: string | null;
  additional_instruction: string | null;
  tool_description: string;
  tool_thumbnail: string | null;
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
  classroom_thumbnail: string | null;
  join_url: string;
  join_code: string;
  tools: Tool[];
  resources: any[];
}
export interface ClassroomData {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
}
export interface Student {
  student_id: number;
  name: string;
  grade: string;
  status: "joined";
  profile_image: string;
  last_join: string;
  firstname: string;
  lastname: string;
  classroom_id: number;
}
