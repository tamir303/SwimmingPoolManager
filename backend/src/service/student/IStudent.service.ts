import Student from "../../dto/student/student.dto.js";

export default interface StudentServiceInterface {
  createStudent(studentData: Student): Promise<Student>;
  loginStudent(studentId: string, password: string): Promise<Student>;
  getAllStudents(): Promise<Student[]>;
  getStudentById(studentId: string): Promise<Student>;
  updateStudent(studentId: string, studentData: Student): Promise<Student | null>;
  deleteStudent(studentId: string): Promise<boolean>;
  deleteAllStudents(): Promise<boolean>;
}
