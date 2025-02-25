import express, { Request, Response } from "express";
import LessonController from "../controller/lesson.controller.js";
import deserializeLessonTimes from "../utils/middleware/deserialize-single-date-object.utils.js";

const lessonRouter = express.Router();
const lessonController = new LessonController();

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: APIs for managing lessons
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - preferences
 *       properties:
 *         id:
 *           type: string
 *           example: "0501234567"
 *           description: Unique identifier (phone number) of the student
 *         name:
 *           type: string
 *           example: "Jane Doe"
 *           description: Full name of the student
 *         preferences:
 *           type: array
 *           items:
 *             type: string
 *             enum: ["CHEST", "BACK_STROKE", "FREESTYLE", "BUTTERFLY"]
 *           example: ["CHEST"]
 *           description: Swimming preferences of the student
 *         password:
 *           type: string
 *           example: "studentpass123"
 *           description: Student's password
 *     NewLesson:
 *       type: object
 *       required:
 *         - typeLesson
 *         - specialties
 *         - instructorId
 *         - startAndEndTime
 *         - students
 *       properties:
 *         typeLesson:
 *           type: string
 *           enum: ["PUBLIC", "PRIVATE", "MIXED"]
 *           example: "PRIVATE"
 *           description: Type of the lesson
 *         specialties:
 *           type: array
 *           items:
 *             type: string
 *             enum: ["CHEST", "BACK_STROKE", "FREESTYLE", "BUTTERFLY"]
 *           example: ["CHEST"]
 *           description: Swimming specialties covered in the lesson
 *         instructorId:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *           description: ID of the instructor teaching the lesson
 *         startAndEndTime:
 *           $ref: '#/components/schemas/StartAndEndTime'
 *         students:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Student'
 *           description: List of students attending the lesson
 *     Lesson:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/NewLesson'
 *         - type: object
 *           properties:
 *             lessonId:
 *               type: string
 *               example: "550e8400-e29b-41d4-a716-446655440000"
 *               description: Unique identifier for the lesson
 */

/**
 * @swagger
 * /lesson:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: day
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 6
 *           example: 2
 *           description: Day of the week (0=Sunday, 6=Saturday)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewLesson'
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Invalid lesson data or scheduling conflict
 *       404:
 *         description: Instructor not found
 *       500:
 *         description: Server error
 */
lessonRouter.post(
  "/",
  deserializeLessonTimes,
  (req: Request, res: Response) => {
    lessonController.createLesson(req, res);
  }
);

/**
 * @swagger
 * /lesson/{lessonId}:
 *   get:
 *     summary: Get a lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         description: Unique identifier of the lesson
 *     responses:
 *       200:
 *         description: Successfully retrieved the lesson
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
lessonRouter.get("/:lessonId", (req: Request, res: Response) => {
  lessonController.getLessonById(req, res);
});

/**
 * @swagger
 * /lesson:
 *   get:
 *     summary: Retrieve all lessons within a date range
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T00:00:00Z"
 *           description: Start of the date range
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-01-31T23:59:59Z"
 *           description: End of the date range
 *     responses:
 *       200:
 *         description: Successfully retrieved lessons within the range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Invalid date range
 *       500:
 *         description: Server error
 */
lessonRouter.get("/", (req: Request, res: Response) => {
  lessonController.getAllLessonsWithinRange(req, res);
});

/**
 * @swagger
 * /lesson/instructor/{instructorId}/day:
 *   get:
 *     summary: Get lessons of an instructor on a specific day
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: instructorId
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: Unique identifier of the instructor
 *       - in: query
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-15"
 *           description: Date to filter lessons (only the day matters)
 *     responses:
 *       200:
 *         description: Successfully retrieved lessons for the instructor on the specified day
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Instructor not found
 *       500:
 *         description: Server error
 */
lessonRouter.get(
  "/instructor/:instructorId/day",
  (req: Request, res: Response) => {
    lessonController.getLessonsOfInstructorByDay(req, res);
  }
);

/**
 * @swagger
 * /lesson/students/{studentId}:
 *   get:
 *     summary: Get lessons by student ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *           example: "0501234567"
 *         description: Unique identifier (phone number) of the student
 *     responses:
 *       200:
 *         description: Successfully retrieved lessons for the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: No lessons found for the student
 *       500:
 *         description: Server error
 */
lessonRouter.get("/students/:studentId", (req: Request, res: Response) => {
  lessonController.getLessonsByStudentId(req, res);
});

/**
 * @swagger
 * /lesson/{lessonId}:
 *   put:
 *     summary: Update a lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         description: Unique identifier of the lesson
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Invalid lesson data or scheduling conflict
 *       404:
 *         description: Lesson or instructor not found
 *       500:
 *         description: Server error
 */
lessonRouter.put(
  "/:lessonId",
  deserializeLessonTimes,
  (req: Request, res: Response) => {
    lessonController.updateLesson(req, res);
  }
);

/**
 * @swagger
 * /lesson/{lessonId}:
 *   delete:
 *     summary: Delete a lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         description: Unique identifier of the lesson
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lesson deleted successfully"
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
lessonRouter.delete("/:lessonId", (req: Request, res: Response) => {
  lessonController.deleteLesson(req, res);
});

/**
 * @swagger
 * /lesson:
 *   delete:
 *     summary: Delete all lessons
 *     tags: [Lessons]
 *     responses:
 *       200:
 *         description: All lessons deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All lessons deleted successfully"
 *       500:
 *         description: Server error
 */
lessonRouter.delete("/", (req: Request, res: Response) => {
  lessonController.deleteAllLessons(req, res);
});

export default lessonRouter;