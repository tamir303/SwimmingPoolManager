import createHttpError from "http-errors";
import path from "path";
import Instructor from "../../dto/instructor/instructor.dto.js";
import InstructorRepositoryInterface from "../../repository/instructor/IInstructor.repository.js";
import InstructorRepository from "../../repository/instructor/instructor.repository.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import InstructorServiceInterface from "./IInstructor.service.js";
import { createCustomLogger } from "../../etc/logger.etc.js";
import LessonRepositoryInterface from "../../repository/lesson/ILesson.repository.js";
import LessonRepository from "../../repository/lesson/lesson.repository.js";
import { Availability } from "../../dto/instructor/start-and-end-time.dto.js";
import { DaysOfWeek } from "../../utils/days-week-enum.utils.js";

// Initialize the logger
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

/**
 * Service for managing instructors.
 * Implements the `InstructorServiceInterface` and provides methods for CRUD operations,
 * validation, and business logic.
 */
export default class InstructorService implements InstructorServiceInterface {
  private instructorRepository: InstructorRepositoryInterface;
  private lessonRepository: LessonRepositoryInterface;

  constructor() {
    this.instructorRepository = new InstructorRepository();
    this.lessonRepository = new LessonRepository();
  }

  /**
   * Creates a new instructor.
   * @param instructorData - Data for the new instructor.
   * @returns A promise that resolves to the newly created instructor.
   * @throws {BadRequest} If the data is invalid.
   */
  async createInstructor(password: string, instructorData: Instructor): Promise<Instructor> {
    logger.info("Validating instructor data...");
    this.validateInstructorData(instructorData);
    const instructor: Instructor = new Instructor(
      instructorData.id,
      instructorData.name,
      instructorData.specialties,
      instructorData.availabilities,
      password
    );

    try {
      logger.info("Creating a new instructor...");
      const createdInstructor = await this.instructorRepository.create(
        password,
        instructor
      );
      logger.info(
        `Instructor created successfully with ID: ${createdInstructor.id}`
      );
      return createdInstructor;
    } catch (error) {
      logger.error("Error occurred while creating instructor:", error);
      throw error;
    }
  }

  async loginInstructor(password: string, instructorId: string): Promise<Instructor> {
    logger.info("Validating instructor data...");

    try {
      logger.info("Login to instructor...");
      const instructor = await this.getInstructorById(instructorId);
      if (instructor.password === password) {
        logger.info(
          `Instructor created successfully with ID: ${instructor.id}`
        );
        return instructor;
    } else {
      throw Error(`${password} is incorrect!`)
    }
    } catch (error) {
      logger.error("Error occurred while login into instructor:", error);
      throw error;
    }
  }

  /**
   * Retrieves all instructors.
   * @returns A promise that resolves to a list of all instructors.
   */
  async getAllInstructors(): Promise<Instructor[]> {
    try {
      logger.info("Fetching all instructors...");
      const instructors = await this.instructorRepository.findAll();
      logger.info(`Found ${instructors.length} instructors.`);
      return instructors;
    } catch (error) {
      logger.error("Error occurred while fetching all instructors:", error);
      throw error;
    }
  }

  /**
   * Retrieves instructors by their specialties.
   * @param specialties - Array of specialties to filter by.
   * @returns A promise that resolves to a list of instructors with the specified specialties.
   * @throws {BadRequest} If any specialty is invalid.
   */
  async getInstructorsBySpecialties(
    specialties: Swimming[]
  ): Promise<Instructor[]> {
    logger.info("Validating specialties...");
    for (const specialty of specialties) {
      if (!Object.values(Swimming).includes(specialty)) {
        logger.warn(`Invalid specialty detected: ${specialty}`);
        throw new createHttpError.BadRequest(
          `Invalid specialty: ${specialty}. Must be one of: ${Object.values(
            Swimming
          ).join(", ")}`
        );
      }
    }

    try {
      logger.info("Fetching instructors by specialties...");
      const instructors = await this.instructorRepository.findBySpecialties(
        specialties
      );
      logger.info(
        `Found ${instructors.length} instructors matching specialties.`
      );
      return instructors;
    } catch (error) {
      logger.error(
        "Error occurred while fetching instructors by specialties:",
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves instructors by their availability.
   * @param day - The day of the week (0 for Sunday, 1 for Monday, etc.).
   * @param startTime - The start time of the availability window.
   * @param endTime - The end time of the availability window.
   * @returns A promise that resolves to a list of available instructors.
   * @throws {BadRequest} If the day or time range is invalid.
   */
  async getInstructorsByAvailability(
    day: number,
    startTime: Date,
    endTime: Date
  ): Promise<Instructor[]> {
    logger.info("Validating availability parameters...");
    if (isNaN(day) || day < 0 || day > 6) {
      logger.warn(`Invalid day: ${day}`);
      throw new createHttpError.BadRequest(
        "Invalid day. Must be between 0 (Sunday) and 6 (Saturday)."
      );
    }

    // Validate the time range
    if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
      logger.warn("Invalid time range provided.");
      throw new createHttpError.BadRequest(
        "Invalid startTime or endTime. They must be valid Date objects."
      );
    }

    if (startTime >= endTime) {
      logger.warn("startTime is greater than or equal to endTime.");
      throw new createHttpError.BadRequest(
        "Invalid time range. startTime must be earlier than endTime."
      );
    }

    try {
      logger.info("Fetching instructors by availability...");
      const instructors =
        await this.instructorRepository.findAvailableInstructors(
          day,
          startTime,
          endTime
        );
      logger.info(`Found ${instructors.length} available instructors.`);
      return instructors;
    } catch (error) {
      logger.error(
        "Error occurred while fetching instructors by availability:",
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves an instructor by their ID.
   * @param id - The unique identifier of the instructor.
   * @returns A promise that resolves to the instructor.
   * @throws {NotFound} If no instructor is found.
   */
  async getInstructorById(id: string): Promise<Instructor> {
    logger.info(`Fetching instructor by ID: ${id}...`);
    const instructor = await this.instructorRepository.findById(id);

    if (!instructor) {
      logger.warn(`Instructor with ID ${id} not found.`);
      throw new createHttpError.NotFound(
        `Instructor with ID ${id} not found`
      );
    }

    logger.info(`Instructor with ID ${id} retrieved successfully.`);
    return instructor;
  }

  /**
   * Updates an instructor by their ID.
   * @param id - The unique identifier of the instructor to update.
   * @param instructorData - The updated instructor data.
   * @returns A promise that resolves to the updated instructor or `null` if not found.
   * @throws {NotFound} If no instructor is found with the given ID.
   * @throws {BadRequest} If the data is invalid.
   */
  async updateInstructor(
    id: string,
    instructorData: Instructor
  ): Promise<Instructor | null> {
    logger.info(
      `Validating and updating instructor with ID: ${id}...`
    );
    const instructor = await this.getInstructorById(id);

    this.validateInstructorData(instructorData);

    const instructorLessons = await this.lessonRepository.getInstructorLessons(id);
    // Check that the new availabilities and specialties do not conflict with existing lessons
    for (const lesson of instructorLessons) {
      // Determine the day index (0 = Sunday, 6 = Saturday) of the lesson
      const lessonDay = lesson.startAndEndTime.startTime.getDay();
      const newAvailability = instructorData.availabilities[lessonDay];
        // Check if the lesson's time fits within the new availability window
        if (newAvailability === -1) {
          throw new createHttpError.BadRequest(
            `Conflict: Existing lesson ${lesson.lessonId} on ${Object.values(DaysOfWeek)[lessonDay]}, cannot remove availability on a same day of an existing lesson.`
          );
        }

        if (!newAvailability || typeof newAvailability !== "object" || !newAvailability.startTime || !newAvailability.endTime) {
          throw new createHttpError.BadRequest("Invalid new availability!");
        }
        
        const lessonStart = new Date(lesson.startAndEndTime.startTime);
        const lessonEnd = new Date(lesson.startAndEndTime.endTime);
        const availStart = new Date(newAvailability.startTime);
        const availEnd = new Date(newAvailability.endTime);

        console.log(`Lesson Start: ${lessonStart}`)
        console.log(`Lesson End: ${lessonEnd}`)
        console.log(`Avail Start: ${availStart}`)
        console.log(`Avail End: ${availEnd}`)

        if (lessonStart.getHours() < availStart.getHours()
           || lessonEnd.getHours() > availEnd.getHours()) {
          const dayName = Object.values(DaysOfWeek)[lessonDay] || "Unknown Day";
          throw new createHttpError.BadRequest(
            `Conflict: Existing lesson ${lesson.lessonId} on ${dayName} does not fit within the new availability window (${availStart.toLocaleTimeString()} - ${availEnd.toLocaleTimeString()}).`
          );
        }

      // Check specialties: Each specialty required by the lesson must be present in the updated specialties
      for (const specialty of lesson.specialties) {
        if (!instructorData.specialties.includes(specialty)) {
          throw new createHttpError.BadRequest(
            `Conflict: Existing lesson ${lesson.lessonId} requires specialty ${specialty}, which is missing in the updated specialties.`
          );
        }
      }

      if (lesson.lessonId)
        await this.lessonRepository
          .updateLesson(lesson.lessonId, { ...lesson, specialties: instructorData.specialties });
    }


    const updatedInstructor: Instructor = {
      id,
      name: instructorData.name,
      specialties: [...instructorData.specialties],
      availabilities: [...instructorData.availabilities],
      password: instructor.password
    };

    try {
      const result = await this.instructorRepository.update(
        id,
        updatedInstructor
      );
      logger.info(`Instructor with ID ${id} updated successfully.`);
      return result;
    } catch (error) {
      logger.error("Error occurred while updating instructor:", error);
      throw error;
    }
  }

  /**
   * Deletes an instructor by their ID.
   * @param id - The unique identifier of the instructor to delete.
   * @returns A promise that resolves to a boolean indicating success.
   */
  async deleteInstructor(id: string): Promise<boolean> {
    logger.info(`Deleting instructor with ID: ${id}...`);
    try {
      const result = await this.instructorRepository.delete(id);
      logger.info(`Instructor with ID ${id} deleted successfully.`);

      const resLessons =
        await this.lessonRepository.deleteLessonsByInstructorId(id);

      if (resLessons)
        logger.info(`All lessons of ${id} deleted successfully.`);

      return result;
    } catch (error) {
      logger.error("Error occurred while deleting instructor:", error);
      throw error;
    }
  }

  /**
   * Deletes all instructors.
   * @returns A promise that resolves to a boolean indicating success.
   */
  async deleteAllInstructors(): Promise<boolean> {
    logger.info("Deleting all instructors...");
    try {
      const result = await this.instructorRepository.deleteAll();
      logger.info("All instructors deleted successfully.");
      const resLessons = await this.lessonRepository.deleteAllLessons();

      if (resLessons) logger.info("All lessons deleted successfully.");

      return result;
    } catch (error) {
      logger.error("Error occurred while deleting all instructors:", error);
      throw error;
    }
  }

  /**
   * Validates instructor data.
   * Ensures that availabilities, specialties, and the instructor's name are valid.
   * @param instructorData - The instructor data to validate.
   * @throws {BadRequest} If any data is invalid.
   */
  private validateInstructorData(
    instructorData: Instructor
  ): void {
    logger.info("Validating instructor data...");
    if (
      instructorData.availabilities.length > 7
    ) {
      logger.warn("Invalid availabilities length.");
      throw new createHttpError.BadRequest(
        "The availabilities for the new instructor must be between 0 and 7 entries."
      );
    }

    if (instructorData.name.trim().length === 0) {
      logger.warn("Instructor name is empty.");
      throw new createHttpError.BadRequest("Instructor name cannot be empty.");
    }

    let numDays = 0;
    // Validate each availability entry
    for (const availability of instructorData.availabilities) {
      if (typeof availability === "object") {
        if (
          isNaN(availability.startTime.getTime()) ||
          isNaN(availability.endTime.getTime())
        ) {
          throw new createHttpError.BadRequest(
            "Invalid date format for startTime or endTime"
          );
        }
        numDays++; // That means that thre is availability
        if (
          availability.startTime.getHours() < 0 ||
          availability.startTime.getHours() > 23
        ) {
          throw new createHttpError.BadRequest(
            `Invalid start time (${availability.startTime}). Must be between 0 and 23.`
          );
        }
        if (
          availability.endTime.getHours() < 0 ||
          availability.endTime.getHours() > 23
        ) {
          throw new createHttpError.BadRequest(
            `Invalid end time (${availability.endTime.getHours()}). Must be between 0 and 23.`
          );
        }
        if (availability.startTime >= availability.endTime) {
          throw new createHttpError.BadRequest(
            `Start time (${availability.startTime.getHours()}:${availability.startTime.getMinutes()}) cannot be greater or equal to end time (${availability.endTime.getHours()}:${availability.endTime.getMinutes()}).`
          );
        }
      }
    }

    // Validate each specialty against the Swimming enum
    for (const specialty of instructorData.specialties) {
      if (!Object.values(Swimming).includes(specialty)) {
        throw new createHttpError.BadRequest(
          `Invalid specialty: ${specialty}. Must be one of: ${Object.values(
            Swimming
          ).join(", ")}`
        );
      }
    }
  }
}
