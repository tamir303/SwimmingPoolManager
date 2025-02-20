import { useState } from "react";
import StudentService from "../../services/student.service";
import Student from "../../dto/student/student.dto";
import Lesson from "../../dto/lesson/lesson.dto";

export const useStudent = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [myLessons, setMyLessons] = useState<Lesson[]>([]);
  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([]);

  const addStudent = async (password: string, studentData: Student) => {
    const data = await StudentService.createStudent(password, studentData)
    setStudent(data)
  }

  const fetchStudent = async (studentId: string) => {
    const data = await StudentService.getStudentById(studentId);
    setStudent(data);
  };

  const updateStudent = async (studentId: string, data: Partial<Student>) => {
    const updated = await StudentService.updateStudent(studentId, data);
    setStudent(updated);
    return updated;
  };

  const fetchMyLessons = async (studentId: string) => {
    const lessons = await StudentService.getMyLessons(studentId);
    setMyLessons(lessons);
  };

  const fetchAvailableLessons = async (studentId: string) => {
    const lessons = await StudentService.getAvailableLessons(studentId);
    setAvailableLessons(lessons);
  };

  const joinLesson = async (studentId: string, lessonId: string) => {
    const res = await StudentService.joinLesson(studentId, lessonId);
    await fetchMyLessons(studentId);
    await fetchAvailableLessons(studentId);
    return res;
  };

  const leaveLesson = async (studentId: string, lessonId: string) => {
    const res = await StudentService.leaveLesson(studentId, lessonId);
    await fetchMyLessons(studentId);
    await fetchAvailableLessons(studentId);
    return res;
  };

  return {
    student,
    myLessons,
    availableLessons,
    fetchStudent,
    updateStudent,
    fetchMyLessons,
    fetchAvailableLessons,
    joinLesson,
    leaveLesson,
  };
};
