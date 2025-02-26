import express from "express";
import { Request, Response } from "express";
import StudentController from "../controller/student.controller.js";

const studentRouter = express.Router();
const studentController = new StudentController();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management APIs
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
 *         - password
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
 *           example: ["CHEST", "BACK_STROKE"]
 *           description: Swimming preferences of the student
 *         password:
 *           type: string
 *           example: "studentpass123"
 *           description: Student's password
 *         typePreference:
 *           $ref: '#/components/schemas/TypePreference'
 *           description: The student's lesson type preferences and priorities
 *     NewStudent:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - preferences
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           example: "0527410953"
 *           description: Phone number of the student
 *         name:
 *           type: string
 *           example: "Jane Doe"
 *           description: Full name of the student
 *         preferences:
 *           type: array
 *           items:
 *             type: string
 *             enum: ["CHEST", "BACK_STROKE", "FREESTYLE", "BUTTERFLY"]
 *           example: ["CHEST", "BACK_STROKE"]
 *           description: Swimming preferences of the student
 *         password:
 *           type: string
 *           example: "studentpass123"
 *           description: Student's password
 *         typePreference:
 *           $ref: '#/components/schemas/TypePreference'
 *           description: The student's lesson type preferences and priorities
 *     TypePreference:
 *       type: object
 *       required:
 *         - preference
 *       properties:
 *         preference:
 *           type: string
 *           enum: ["PUBLIC", "PRIVATE", "MIXED"]
 *           example: "PUBLIC"
 *           description: The preferred lesson type
 *         priority1:
 *           type: string
 *           enum: ["PUBLIC", "PRIVATE", "MIXED"]
 *           nullable: true
 *           example: null
 *           description: First priority alternative lesson type, can be null
 *         priority2:
 *           type: string
 *           enum: ["PUBLIC", "PRIVATE", "MIXED"]
 *           nullable: true
 *           example: null
 *           description: Second priority alternative lesson type, can be null
 */

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newStudent:
 *                 $ref: '#/components/schemas/NewStudent'
 *               password:
 *                 type: string
 *                 example: "studentpass123"
 *             required:
 *               - newStudent
 *               - password
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid student data
 *       500:
 *         description: Server error
 */
studentRouter.post("/", async (req: Request, res: Response) => {
  studentController.createStudent(req, res);
});

/**
 * @swagger
 * /student/login:
 *   post:
 *     summary: Log in a student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "0501234567"
 *                 description: Student's unique identifier (phone number)
 *               password:
 *                 type: string
 *                 example: "studentpass123"
 *                 description: Student's password
 *             required:
 *               - id
 *               - password
 *     responses:
 *       201:
 *         description: Student logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized - Invalid credentials
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
studentRouter.post("/login", async (req: Request, res: Response) => {
  studentController.loginStudent(req, res);
});

/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "0501234567"
 *         description: Unique identifier (phone number) of the student
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
studentRouter.get("/:id", async (req: Request, res: Response) => {
  studentController.getStudentById(req, res);
});

/**
 * @swagger
 * /student/{id}:
 *   put:
 *     summary: Update a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "0501234567"
 *         description: Unique identifier (phone number) of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
studentRouter.put("/:id", async (req: Request, res: Response) => {
  studentController.updateStudent(req, res);
});

/**
 * @swagger
 * /student/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "0501234567"
 *         description: Unique identifier (phone number) of the student
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student deleted successfully"
 *                 result:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
studentRouter.delete("/:id", async (req: Request, res: Response) => {
  studentController.deleteStudent(req, res);
});

/**
 * @swagger
 * /student/join/{studentId}/{lessonId}:
 *   put:
 *     summary: Join a lesson
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *           example: "0501234567"
 *         description: Unique identifier (phone number) of the student
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         description: Unique identifier of the lesson
 *     responses:
 *       200:
 *         description: Student joined the lesson successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Student 0501234567 was added to requested lesson 550e8400-e29b-41d4-a716-446655440000"
 *       400:
 *         description: Invalid request or scheduling conflict
 *       404:
 *         description: Student or lesson not found
 *       409:
 *         description: Student already enrolled in the lesson
 *       500:
 *         description: Server error
 */
studentRouter.put("/join/:studentId/:lessonId", async (req: Request, res: Response) => {
  studentController.joinLesson(req, res);
});

/**
 * @swagger
 * /student/leave/{studentId}/{lessonId}:
 *   put:
 *     summary: Leave a lesson
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *           example: "0501234567"
 *         description: Unique identifier (phone number) of the student
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         description: Unique identifier of the lesson
 *     responses:
 *       200:
 *         description: Student left the lesson successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Student 0501234567 left requested lesson 550e8400-e29b-41d4-a716-446655440000"
 *       404:
 *         description: Student not enrolled in the lesson or lesson not found
 *       500:
 *         description: Server error
 */
studentRouter.put("/leave/:studentId/:lessonId", async (req: Request, res: Response) => {
  studentController.leaveLesson(req, res);
});

/**
 * @swagger
 * /student/{id}/available-lessons:
 *   get:
 *     summary: Get available lessons for a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "0501234567"
 *         description: Unique identifier (phone number) of the student
 *     responses:
 *       200:
 *         description: Successfully retrieved available lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: No available lessons found or student not found
 *       500:
 *         description: Server error
 */
studentRouter.get("/:id/available-lessons", async (req: Request, res: Response) => {
  studentController.getAvailableLessons(req, res);
});

/**
 * @swagger
 * /student/{id}/my-lessons:
 *   get:
 *     summary: Get a student's enrolled lessons
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "0501234567"
 *         description: Unique identifier (phone number) of the student
 *     responses:
 *       200:
 *         description: Successfully retrieved enrolled lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Student not found or no lessons enrolled
 *       500:
 *         description: Server error
 */
studentRouter.get("/:id/my-lessons", async (req: Request, res: Response) => {
  studentController.getMyLessons(req, res);
});

export default studentRouter;