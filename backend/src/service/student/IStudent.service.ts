import Lesson from "../../dto/lesson/lesson.dto.js";
import Student from "../../dto/student/student.dto.js";

export default interface StudentServiceInterface {
  getMyLessons(id: string): Promise<Lesson[]>;
  getAvailableLessons(id: string): Promise<Lesson[]>;
  leaveLesson(studentId: string, lessonId: string): Promise<Student>;
  joinLesson(studentId: string, lessonId: string): Promise<Student>;
  createStudent(studentData: Student): Promise<Student>;
  loginStudent(studentId: string, password: string): Promise<Student>;
  getAllStudents(): Promise<Student[]>;
  getStudentById(studentId: string): Promise<Student>;
  updateStudent(studentId: string, studentData: Student): Promise<Student | null>;
  deleteStudent(studentId: string): Promise<boolean>;
  deleteAllStudents(): Promise<boolean>;
}
