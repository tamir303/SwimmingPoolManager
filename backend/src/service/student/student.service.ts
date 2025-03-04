import createHttpError from "http-errors";
import Student from "../../dto/student/student.dto.js";
import StudentRepositoryInterface from "../../repository/student/IStudent.repository.js";
import StudentRepository from "../../repository/student/student.repository.js";
import StudentServiceInterface from "./IStudent.service.js";
import Lesson from "../../dto/lesson/lesson.dto.js";
import LessonServiceInterface from "../lesson/ILesson.service.js";
import LessonService from "../lesson/lesson.service.js";
import { createCustomLogger } from "../../etc/logger.etc.js";
import path from "path";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import { LessonType } from "../../utils/lesson-enum.utils.js";

// Initialize logger
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

export default class StudentService implements StudentServiceInterface {
  private studentRepository: StudentRepositoryInterface;
  private lessonService: LessonServiceInterface;

  constructor() {
    this.studentRepository = new StudentRepository();
    this.lessonService = new LessonService();
  }

  async getMyLessons(studentId: string): Promise<Lesson[]> {
    logger.info(`Fetching lessons for student with id ${studentId}`);
    try {
      await this.getStudentById(studentId); // Ensure student exists
      const availableLessons: Lesson[] = await this.getAvailableLessons(studentId);
      // Filter lessons where the student is enrolled
      const myLessons: Lesson[] = availableLessons.filter((lesson) =>
        lesson.students.some((student) => student.id === studentId)
      );
      logger.info(`Found ${myLessons.length} lessons for student ${studentId}`);
      return myLessons;
    } catch (error: any) {
      logger.error(`Error in getMyLessons for student ${studentId}: ${error.message}`);
      throw error;
    }
  }

  async getAvailableLessons(studentId: string): Promise<Lesson[]> {
    logger.info(`Fetching available lessons for student with id ${studentId}`);
    try {
      const requestedStudent: Student = await this.getStudentById(studentId);
      const start = new Date();
      const end = new Date(start);
      end.setDate(end.getDate() + 30);

      // Fetch lessons by range of month forward
      const availableLessonsByDate = await this.lessonService.getAllLessonsWithinRange(start, end);

      // Check if any lesson specialty matches one of the student's preferences
      let availableLessonsByDateAndPref = availableLessonsByDate.filter((lesson) =>
        requestedStudent.preferences.every((preference: Swimming) =>
          lesson.specialties.includes(preference)
        )
      );

      // Check if lesson type matches student lesson preference
      availableLessonsByDateAndPref = availableLessonsByDateAndPref.filter((lesson) => {
          if (requestedStudent.typePreference.preference === LessonType.PUBLIC)
            return lesson.typeLesson === LessonType.PUBLIC

          if (requestedStudent.typePreference.preference === LessonType.PRIVATE)
            return lesson.typeLesson === LessonType.PRIVATE

          // Else requestedStudent type preference is mixed, return all
          return true
        }  
      )

      if (availableLessonsByDateAndPref.length === 0) {
        const errorMsg = "No available lessons found!";
        logger.warn(errorMsg);
        throw new createHttpError.NotFound(errorMsg);
      }
      logger.info(`Found ${availableLessonsByDateAndPref.length} available lessons for student ${studentId}`);
      return availableLessonsByDateAndPref;
    } catch (error: any) {
      logger.error(`Error in getAvailableLessons for student ${studentId}: ${error.message}`);
      throw error;
    }
  }

  async leaveLesson(studentId: string, lessonId: string): Promise<Student> {
    logger.info(`Student ${studentId} attempting to leave lesson ${lessonId}`);
    try {
      const requestedStudent: Student = await this.getStudentById(studentId);
      const requestedLesson: Lesson = await this.lessonService.getLessonById(lessonId);
      const isStudentInLesson = requestedLesson.students.some((student) => student.id === studentId);
      if (!isStudentInLesson) {
        const errorMsg = `Student ${studentId} is not enrolled in lesson ${lessonId}`;
        logger.warn(errorMsg);
        throw new createHttpError.NotFound(errorMsg);
      }
      // Remove the student from the lesson's students array
      requestedLesson.students = requestedLesson.students.filter((student) => student.id !== studentId);
      await this.lessonService.updateLesson(lessonId, requestedLesson, "student");
      logger.info(`Student ${studentId} left lesson ${lessonId} successfully`);
      return requestedStudent;
    } catch (error: any) {
      logger.error(`Error in leaveLesson for student ${studentId} and lesson ${lessonId}: ${error.message}`);
      throw error;
    }
  }

  async joinLesson(studentId: string, lessonId: string): Promise<Student> {
    logger.info(`Student ${studentId} attempting to join lesson ${lessonId}`);
    try {
      const requestedStudent: Student = await this.getStudentById(studentId);
      const requestedLesson: Lesson = await this.lessonService.getLessonById(lessonId);
      // Check if the student is already enrolled
      const isAlreadyEnrolled = requestedLesson.students.some((student) => student.id === studentId);
      if (isAlreadyEnrolled) {
        const errorMsg = `Student ${studentId} is already enrolled in lesson ${lessonId}`;
        logger.warn(errorMsg);
        throw new createHttpError.Conflict(errorMsg);
      }
      requestedLesson.students.push(requestedStudent);
      await this.lessonService.updateLesson(lessonId, requestedLesson, "student");
      logger.info(`Student ${studentId} joined lesson ${lessonId} successfully`);
      return requestedStudent;
    } catch (error: any) {
      logger.error(`Error in joinLesson for student ${studentId} and lesson ${lessonId}: ${error.message}`);
      throw error;
    }
  }

  async createStudent(studentData: Student): Promise<Student> {
    logger.info(`Creating student with id ${studentData.id}`);
    try {
      const newStudent = await this.studentRepository.create(studentData);
      logger.info(`Student created with id ${newStudent.id}`);
      return newStudent;
    } catch (error: any) {
      logger.error(`Error in createStudent: ${error.message}`);
      throw error;
    }
  }

  async loginStudent(studentId: string, password: string): Promise<Student> {
    logger.info(`Student ${studentId} attempting login`);
    try {
      const student = await this.getStudentById(studentId);
      if (student.password === password) {
        logger.info(`Student ${studentId} logged in successfully`);
        return student;
      } else {
        const errorMsg = "Incorrect password!";
        logger.warn(`Login failed for student ${studentId}: ${errorMsg}`);
        throw new createHttpError.Unauthorized(errorMsg);
      }
    } catch (error: any) {
      logger.error(`Error in loginStudent for student ${studentId}: ${error.message}`);
      throw error;
    }
  }

  async getAllStudents(): Promise<Student[]> {
    logger.info("Fetching all students");
    try {
      const students = await this.studentRepository.findAll();
      logger.info(`Fetched ${students.length} students`);
      return students;
    } catch (error: any) {
      logger.error(`Error in getAllStudents: ${error.message}`);
      throw error;
    }
  }

  async getStudentById(studentId: string): Promise<Student> {
    logger.info(`Fetching student with id ${studentId}`);
    try {
      const student = await this.studentRepository.findById(studentId);
      if (!student) {
        const errorMsg = `Student with ID ${studentId} not found`;
        logger.warn(errorMsg);
        throw new createHttpError.NotFound(errorMsg);
      }
      logger.info(`Student with id ${studentId} found`);
      return student;
    } catch (error: any) {
      logger.error(`Error in getStudentById for id ${studentId}: ${error.message}`);
      throw error;
    }
  }

  async updateStudent(studentId: string, studentData: Student): Promise<Student | null> {
    logger.info(`Updating student with id ${studentId}`);
    try {
      const updatedStudent = await this.studentRepository.update(studentId, studentData);

      if (!updatedStudent) {
        const errorMsg = `Student with ID ${studentId} not found for update`;
        logger.warn(errorMsg);
        throw new createHttpError.Forbidden(errorMsg);
      }

      const studentLessons: Lesson[] = await this.lessonService.getLessonsByStudentId(studentId);

      // Validate student not in lesson that violates its swimming styles
      for (const lesson of studentLessons) {
        const lessonSwimmings = lesson.specialties;
        const studentSwimmings = studentData.preferences;
        for (const swimming of studentSwimmings) {
          if (!lessonSwimmings.includes(swimming)) {
            const errorMsg = `Student's lesson ${lesson.lessonId} doesn't contain ${swimming}, leave lesson to update student!`;
            logger.warn(errorMsg);
            throw new createHttpError.Forbidden(errorMsg);
          }
        }
      }

      // Validate student not in lesson that violates its lesson type preference
      for (const lesson of studentLessons) {
        const lessonType = lesson.typeLesson;
        const studentLessonTypePref = studentData.typePreference.preference;
        if (studentLessonTypePref !== LessonType.MIXED && lessonType !== studentLessonTypePref) {
          const errorMsg = `Student enrolled in lesson ${lesson.lessonId} which is ${lessonType}, leave lesson to update student!`;
          logger.warn(errorMsg);
          throw new createHttpError.NotFound(errorMsg);
        }
      }

      logger.info(`Student with id ${studentId} updated successfully`);
      return updatedStudent;
    } catch (error: any) {
      logger.error(`Error in updateStudent for id ${studentId}: ${error.message}`);
      throw error;
    }
  }

  async deleteStudent(studentId: string): Promise<boolean> {
    logger.info(`Deleting student with id ${studentId}`);
    try {
      const result = await this.studentRepository.delete(studentId);
      if (!result) {
        const errorMsg = `Student with ID ${studentId} not found for deletion`;
        logger.warn(errorMsg);
        throw new createHttpError.NotFound(errorMsg);
      }
      logger.info(`Student with id ${studentId} deleted successfully`);
      return result;
    } catch (error: any) {
      logger.error(`Error in deleteStudent for id ${studentId}: ${error.message}`);
      throw error;
    }
  }

  async deleteAllStudents(): Promise<boolean> {
    logger.info("Deleting all students");
    try {
      const result = await this.studentRepository.deleteAll();
      logger.info("All students deleted successfully");
      return result;
    } catch (error: any) {
      logger.error(`Error in deleteAllStudents: ${error.message}`);
      throw error;
    }
  }
}
