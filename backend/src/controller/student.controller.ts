import { Request, Response } from "express";
import StudentService from "../service/student/student.service.js";
import Student from "../dto/student/student.dto.js";
import StudentServiceInterface from "../service/student/IStudent.service.js";
import Lesson from "../dto/lesson/lesson.dto.js";

export default class StudentController {
  private studentService: StudentServiceInterface;

  constructor() {
    this.studentService = new StudentService();
  }

  async createStudent(req: Request, res: Response): Promise<Response> {
    try {
      const studentData: Student = req.body.newStudent;
      const password: string = req.body.password;
      studentData.password = password
      const newStudent = await this.studentService.createStudent(studentData);
      return res.status(201).json(newStudent);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

    async loginStudent(req: Request, res: Response): Promise<Response> {
      try {
        const studentId: string = req.body.id;
        const password: string = req.body.password;
        const student: Student =
          await this.studentService.loginStudent(studentId, password);
        return res.status(201).json(student);
      } catch (error: any) {
        const errorMessage =
          process.env.NODE_ENV !== "prod"
            ? error.message
            : "An error occurred while login to an student.";
        return res.status(error.status || 500).json({ error: errorMessage });
      }
    }

  async getStudentById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const student = await this.studentService.getStudentById(id);
      return res.status(200).json(student);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async updateStudent(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const studentData: Student = req.body;
      const updatedStudent = await this.studentService.updateStudent(id, studentData);
      return res.status(200).json(updatedStudent);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteStudent(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const result = await this.studentService.deleteStudent(id);
      return res.status(200).json({ message: "Student deleted successfully", result });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async joinLesson(req: Request, res: Response): Promise<Response> {
    try {
      const { studentId, lessonId } = req.params;
      const studentData: Student = await this.studentService.joinLesson(studentId, lessonId)
      return res.status(200).json(`Student ${studentId} was added to requested lesson ${lessonId}`);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async leaveLesson(req: Request, res: Response): Promise<Response> {
    try {
      const { studentId, lessonId } = req.params;
      const studentData: Student = await this.studentService.leaveLesson(studentId, lessonId)
      return res.status(200).json(`Student ${studentId} left requested lesson ${lessonId}`);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getAvailableLessons(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const availLessons: Lesson[] = await this.studentService.getAvailableLessons(id);
      return res.status(200).json(availLessons);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getMyLessons(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const mylessons: Lesson[] = await this.studentService.getMyLessons(id);
      return res.status(200).json(mylessons);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
