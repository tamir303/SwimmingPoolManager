import axios from "axios";
import Student from "../dto/student/student.dto";
import Lesson from "../dto/lesson/lesson.dto";
import getEnvVariables from "../etc/load-variables";

const { backendServerURL } = getEnvVariables();
const BASE_URL = `${backendServerURL}/student`;


export default class StudentService {
/**
 * A wrapper method for handling Axios requests with error handling.
 *
 * @template T
 * @param {() => Promise<T>} request - The Axios request to wrap.
 * @returns {Promise<T>} The result of the Axios request.
 * @throws {Error} Throws an error if the request fails.
 */
static async requestWrapper<T>(request: () => Promise<T>): Promise<T> {
    try {
        return await request();
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
        // Re-throw the Axios error for the caller to handle
        throw error;
        }
        // If it's not an AxiosError, throw a generic error
        throw new Error("An unexpected error occurred");
    }
}

static async createStudent(password: string,newStudent: Student): Promise<Student> {
console.log({password: password,newStudent: newStudent})
    return this.requestWrapper(() =>axios.post<Student>(BASE_URL, {password, newStudent}).then((res) => res.data));
}

static async loginStudent(id: string, password: string): Promise<Student> {
    console.log({password: password,id: id})
    return this.requestWrapper(() =>axios.post<Student>(`${BASE_URL}/login`, {password, id}).then((res) => res.data));
}

  static async getStudentById(studentId: string): Promise<Student> {
    return this.requestWrapper(() =>axios.get<Student>(`${BASE_URL}/${studentId}`).then((res) => res.data));
  }

  static async updateStudent(studentId: string, data: Partial<Student>): Promise<Student> {
    return this.requestWrapper(() =>axios.put<Student>(`${BASE_URL}/${studentId}`, data).then((res) => res.data));
  }

  static async joinLesson(studentId: string, lessonId: string): Promise<any> {
    return this.requestWrapper(() =>axios.post(`${BASE_URL}/${studentId}/join`, { lessonId }).then((res) => res.data));
  }

  static async leaveLesson(studentId: string, lessonId: string): Promise<any> {
    return this.requestWrapper(() =>axios.post(`${BASE_URL}/${studentId}/leave`, { lessonId }).then((res) => res.data));
  }

  static async getAvailableLessons(studentId: string): Promise<Lesson[]> {
    return this.requestWrapper(() =>axios.get<Lesson[]>(`${BASE_URL}/${studentId}/available-lessons`).then((res) => res.data));
  }

  static async getMyLessons(studentId: string): Promise<Lesson[]> {
    return this.requestWrapper(() =>axios.get<Lesson[]>(`${BASE_URL}/${studentId}/my-lessons`).then((res) => res.data));
  }
}
