import { useState } from "react";
import LessonService from "../../services/lesson.service";
import NewLesson from "../../dto/lesson/new-lesson.dto";
import Lesson from "../../dto/lesson/lesson.dto";

interface UseLessonReturn {
  loading: boolean;
  error: Error | null;
  createLesson: (newLesson: NewLesson, day: number) => Promise<Lesson>;
  getLessonById: (lessonId: string) => Promise<Lesson>;
  updateLesson: (lessonId: string, updatedLesson: Lesson) => Promise<Lesson>;
  deleteLessonById: (lessonId: string) => Promise<void>;
  getLessonsWithinRange: (start: Date, end: Date) => Promise<Lesson[]>;
  getLessonsOfInstructorByDay: (
    instructorId: string,
    day: Date
  ) => Promise<Lesson[]>;
}

const useLesson = (): UseLessonReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createLesson = async (
    newLesson: NewLesson,
    day: number
  ): Promise<Lesson> => {
    setLoading(true);
    setError(null);
    try {
      const lesson = await LessonService.createLesson(newLesson, day);
      return lesson;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLessonById = async (lessonId: string): Promise<Lesson> => {
    setLoading(true);
    setError(null);
    try {
      const lesson = await LessonService.getLessonById(lessonId);
      return lesson;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLesson = async (
    lessonId: string,
    updatedLesson: Lesson
  ): Promise<Lesson> => {
    setLoading(true);
    setError(null);
    try {
      const lesson = await LessonService.updateLesson(lessonId, updatedLesson);
      return lesson;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLessonById = async (lessonId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await LessonService.deleteLessonById(lessonId);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLessonsWithinRange = async (
    start: Date,
    end: Date
  ): Promise<Lesson[]> => {
    setLoading(true);
    setError(null);
    try {
      const lessons = await LessonService.getLessonsWithinRange(start, end);
      return lessons;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLessonsOfInstructorByDay = async (
    instructorId: string,
    day: Date
  ): Promise<Lesson[]> => {
    setLoading(true);
    setError(null);
    try {
      const lessons = await LessonService.getLessonsOfInstructorByDay(
        instructorId,
        day
      );
      return lessons;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createLesson,
    getLessonById,
    updateLesson,
    deleteLessonById,
    getLessonsWithinRange,
    getLessonsOfInstructorByDay,
  };
};

export default useLesson;
