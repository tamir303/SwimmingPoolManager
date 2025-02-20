import Student from "../../dto/student/student.dto.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";

export default interface StudentRepositoryInterface {
  create(studentData: Student): Promise<Student>;
  findAll(): Promise<Student[]>;
  findById(studentId: string): Promise<Student | null>;
  update(studentId: string, studentData: Student): Promise<Student | null>;
  delete(studentId: string): Promise<boolean>;
  deleteAll(): Promise<boolean>;
}
