import createHttpError from "http-errors";
import Student from "../../dto/student/student.dto.js";
import StudentRepositoryInterface from "../../repository/student/IStudent.repository.js";
import StudentRepository from "../../repository/student/student.repository.js";
import StudentServiceInterface from "./IStudent.service.js";

export default class StudentService implements StudentServiceInterface {
  private studentRepository: StudentRepositoryInterface;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async createStudent(studentData: Student): Promise<Student> {
    return this.studentRepository.create(studentData);
  }

  async loginStudent(studentId: string, password: string): Promise<Student> {
    try {
      const student = await this.getStudentById(studentId);
      if (student.password === password) {
        return student;
    } else {
      throw Error(`${password} is incorrect!`)
    }
    } catch (error) {
      throw error;
    }
  }

  async getAllStudents(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }

  async getStudentById(studentId: string): Promise<Student> {
    const student = await this.studentRepository.findById(studentId);

    if (!student) {
      throw new createHttpError.NotFound(
        `Student with ID ${studentId} not found`
      );
    }

    return student;
  }

  async updateStudent(studentId: string, studentData: Student): Promise<Student | null> {
    return this.studentRepository.update(studentId, studentData);
  }

  async deleteStudent(studentId: string): Promise<boolean> {
    return this.studentRepository.delete(studentId);
  }

  async deleteAllStudents(): Promise<boolean> {
    return this.studentRepository.deleteAll();
  }
}
