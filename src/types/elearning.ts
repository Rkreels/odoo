
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  price: string;
  status: CourseStatus;
  category: string;
  rating: number;
  enrolledStudents: number;
  lessons: number;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  progress: { [courseId: string]: number };
  certificates: string[];
}
