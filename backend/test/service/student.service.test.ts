import { jest } from "@jest/globals";
import StudentService from "../../src/service/student/student.service.js";
import Student from "../../src/dto/student/student.dto.js";
import Lesson from "../../src/dto/lesson/lesson.dto.js";
import { Swimming } from "../../src/utils/swimming-enum.utils.js";
import { LessonType } from "../../src/utils/lesson-enum.utils.js";
import StartAndEndTime from "../../src/dto/instructor/start-and-end-time.dto.js";
import createHttpError from "http-errors";
import TypePreference from "../../src/dto/student/typePreference.dto.js";

const mockStudentRepo = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
} as any;

const mockLessonService = {
  getAllLessonsWithinRange: jest.fn(),
  getLessonById: jest.fn(),
  updateLesson: jest.fn(),
} as any;

describe("StudentService", () => {
  let service: StudentService;

  beforeEach(() => {
    service = new StudentService();
    (service as any).studentRepository = mockStudentRepo;
    (service as any).lessonService = mockLessonService;
    jest.clearAllMocks();
  });

  describe("createStudent", () => {
    it("should create a new student", async () => {
      const student = new Student("0501234567", "Jane Doe", [Swimming.CHEST], "pass123", new TypePreference(LessonType.PUBLIC, null, null));
      mockStudentRepo.create.mockResolvedValue(student);

      const result = await service.createStudent(student);
      expect(result).toEqual(student);
    });
  });

  describe("loginStudent", () => {
    it("should login a student with correct credentials", async () => {
      const student = new Student("0501234567", "Jane Doe", [Swimming.CHEST], "pass123", new TypePreference(LessonType.PUBLIC, null, null));
      mockStudentRepo.findById.mockResolvedValue(student);

      const result = await service.loginStudent("0501234567", "pass123");
      expect(result).toEqual(student);
    });

    it("should throw Unauthorized for incorrect password", async () => {
      const student = new Student("0501234567", "Jane Doe", [Swimming.CHEST], "pass123", new TypePreference(LessonType.PUBLIC, null, null));
      mockStudentRepo.findById.mockResolvedValue(student);

      await expect(service.loginStudent("0501234567", "wrongpass")).rejects.toThrow(createHttpError.Unauthorized);
    });
  });

  describe("getMyLessons", () => {
    it("should retrieve enrolled lessons", async () => {
      const student = new Student("0501234567", "Jane Doe", [Swimming.CHEST], "pass123", new TypePreference(LessonType.PUBLIC, null, null));
      const lesson = new Lesson(
        "123",
        LessonType.PUBLIC,
        [Swimming.CHEST],
        "456",
        new StartAndEndTime(new Date(), new Date()),
        [student]
      );
      mockStudentRepo.findById.mockResolvedValue(student);
      mockLessonService.getAllLessonsWithinRange.mockResolvedValue([lesson]);

      const result = await service.getMyLessons("0501234567");
      expect(result).toEqual([lesson]);
    });
  });

  describe("getAvailableLessons", () => {
    it("should retrieve available lessons matching preferences", async () => {
      const student = new Student("0501234567", "Jane Doe", [Swimming.CHEST], "pass123", new TypePreference(LessonType.PUBLIC, null, null));
      const lesson = new Lesson(
        "123",
        LessonType.PUBLIC,
        [Swimming.CHEST],
        "456",
        new StartAndEndTime(new Date(), new Date()),
        []
      );
      mockStudentRepo.findById.mockResolvedValue(student);
      mockLessonService.getAllLessonsWithinRange.mockResolvedValue([lesson]);

      const result = await service.getAvailableLessons("0501234567");
      expect(result).toEqual([lesson]);
    });
  });

  describe("joinLesson", () => {
    it("should join a lesson", async () => {
      const student = new Student("0501234567", "Jane Doe", [Swimming.CHEST], "pass123", new TypePreference(LessonType.PUBLIC, null, null));
      const lesson = new Lesson("123", LessonType.PUBLIC, [Swimming.CHEST], "456", new StartAndEndTime(new Date(), new Date()), []);
      mockStudentRepo.findById.mockResolvedValue(student);
      mockLessonService.getLessonById.mockResolvedValue(lesson);
      mockLessonService.updateLesson.mockResolvedValue({ ...lesson, students: [student] });

      const result = await service.joinLesson("0501234567", "123");
      expect(result).toEqual(student);
    });
  });

  describe("leaveLesson", () => {
    it("should leave a lesson", async () => {
      const student = new Student("0501234567", "Jane Doe", [Swimming.CHEST], "pass123", new TypePreference(LessonType.PUBLIC, null, null));
      const lesson = new Lesson("123", LessonType.PUBLIC, [Swimming.CHEST], "456", new StartAndEndTime(new Date(), new Date()), [student]);
      mockStudentRepo.findById.mockResolvedValue(student);
      mockLessonService.getLessonById.mockResolvedValue(lesson);
      mockLessonService.updateLesson.mockResolvedValue({ ...lesson, students: [] });

      const result = await service.leaveLesson("0501234567", "123");
      expect(result).toEqual(student);
    });
  });
});