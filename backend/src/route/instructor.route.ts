import express from "express";
import { Request, Response } from "express";
import InstructorController from "../controller/instructor.controller.js";
import deserializeAvailabilities from "../utils/middleware/deserialize-date-objects.utils.js";

const instructorRouter = express.Router();
const instructorController = new InstructorController();

/**
 * @swagger
 * tags:
 *   name: Instructors
 *   description: Instructor management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StartAndEndTime:
 *       type: object
 *       required:
 *         - startTime
 *         - endTime
 *       properties:
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2025-01-16T09:00:00Z"
 *           description: Start time in ISO 8601 format (UTC), only hours and minutes are relevant
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2025-01-16T17:00:00Z"
 *           description: End time in ISO 8601 format (UTC), only hours and minutes are relevant
 *     Availability:
 *       type: array
 *       minItems: 7
 *       maxItems: 7
 *       items:
 *         oneOf:
 *           - type: integer
 *             example: -1
 *             description: Indicates unavailability for the day
 *           - $ref: '#/components/schemas/StartAndEndTime'
 *       description: Array of 7 entries representing weekly availability (0-Sunday, 6-Saturday)
 *       example: [-1, {"startTime": "2025-01-16T09:00:00Z", "endTime": "2025-01-16T17:00:00Z"}, -1, -1, -1, -1, -1]
 *     Instructor:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - specialties
 *         - availabilities
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *           description: Unique identifier for the instructor
 *         name:
 *           type: string
 *           example: "John Doe"
 *           description: Full name of the instructor
 *         specialties:
 *           type: array
 *           items:
 *             type: string
 *             enum: ["CHEST", "BACK_STROKE", "FREESTYLE", "BUTTERFLY"]  # Adjust based on your Swimming enum
 *           example: ["CHEST", "BACK_STROKE"]
 *           description: List of swimming specialties the instructor can teach
 *         availabilities:
 *           $ref: '#/components/schemas/Availability'
 *         password:
 *           type: string
 *           example: "securepassword123"
 *           description: Instructor's password
 *     NewInstructor:
 *       type: object
 *       required:
 *         - name
 *         - specialties
 *         - availabilities
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *           description: Full name of the new instructor
 *         specialties:
 *           type: array
 *           items:
 *             type: string
 *             enum: ["CHEST", "BACK_STROKE", "FREESTYLE", "BUTTERFLY"]
 *           example: ["CHEST", "BACK_STROKE"]
 *           description: List of swimming specialties the new instructor can teach
 *         availabilities:
 *           $ref: '#/components/schemas/Availability'
 *         password:
 *           type: string
 *           example: "securepassword123"
 *           description: Instructor's password
 */

/**
 * @swagger
 * /instructor:
 *   post:
 *     summary: Register a new instructor
 *     tags: [Instructors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newInstructor:
 *                 $ref: '#/components/schemas/NewInstructor'
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *             required:
 *               - newInstructor
 *               - password
 *     responses:
 *       201:
 *         description: Instructor successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       400:
 *         description: Invalid instructor data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid specialty: XYZ"
 *       500:
 *         description: Server error
 */
instructorRouter.post(
  "/",
  deserializeAvailabilities,
  async (req: Request, res: Response) => {
    instructorController.createInstructor(req, res);
  }
);

/**
 * @swagger
 * /instructor/login:
 *   post:
 *     summary: Log in an instructor
 *     tags: [Instructors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *                 description: Instructor's unique identifier
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *                 description: Instructor's password
 *             required:
 *               - id
 *               - password
 *     responses:
 *       201:
 *         description: Instructor logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Incorrect password!"
 *       404:
 *         description: Instructor not found
 *       500:
 *         description: Server error
 */
instructorRouter.post(
  "/login",
  deserializeAvailabilities,
  async (req: Request, res: Response) => {
    instructorController.loginInstructor(req, res);
  }
);

/**
 * @swagger
 * /instructor:
 *   get:
 *     summary: Get all instructors
 *     tags: [Instructors]
 *     responses:
 *       200:
 *         description: Successfully retrieved all instructors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instructor'
 *       500:
 *         description: Server error
 */
instructorRouter.get("/", async (req: Request, res: Response) => {
  instructorController.getAllInstructors(req, res);
});

/**
 * @swagger
 * /instructor/specialties:
 *   get:
 *     summary: Get instructors by specialties
 *     tags: [Instructors]
 *     parameters:
 *       - in: query
 *         name: specialties
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: ["CHEST", "BACK_STROKE", "FREESTYLE", "BUTTERFLY"]
 *           example: ["CHEST", "BACK_STROKE"]
 *         explode: true
 *         description: List of specialties to filter by
 *     responses:
 *       200:
 *         description: Successfully retrieved instructors with given specialties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instructor'
 *       400:
 *         description: Invalid specialties provided
 *       500:
 *         description: Server error
 */
instructorRouter.get("/specialties", async (req: Request, res: Response) => {
  instructorController.getInstructorsBySpecialties(req, res);
});

/**
 * @swagger
 * /instructor/availability:
 *   get:
 *     summary: Get instructors available on a specific day and time
 *     tags: [Instructors]
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
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-01-16T09:00:00Z"
 *           description: Start time in ISO 8601 format
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-01-16T17:00:00Z"
 *           description: End time in ISO 8601 format
 *     responses:
 *       200:
 *         description: List of instructors available
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instructor'
 *       400:
 *         description: Invalid day or time range
 *       500:
 *         description: Server error
 */
instructorRouter.get("/availability", async (req: Request, res: Response) => {
  instructorController.getInstructorsByAvailability(req, res);
});

/**
 * @swagger
 * /instructor/single/{id}:
 *   get:
 *     summary: Get an instructor by ID
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: Unique identifier of the instructor
 *     responses:
 *       200:
 *         description: Successfully retrieved instructor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       404:
 *         description: Instructor not found
 *       500:
 *         description: Server error
 */
instructorRouter.get("/single/:id", async (req: Request, res: Response) => {
  instructorController.getInstructorById(req, res);
});

/**
 * @swagger
 * /instructor/{id}:
 *   put:
 *     summary: Update an instructor
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: Unique identifier of the instructor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instructor'
 *     responses:
 *       200:
 *         description: Instructor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       400:
 *         description: Invalid data or conflicts with existing lessons
 *       404:
 *         description: Instructor not found
 *       500:
 *         description: Server error
 */
instructorRouter.put(
  "/:id",
  deserializeAvailabilities,
  async (req: Request, res: Response) => {
    instructorController.updateInstructor(req, res);
  }
);

/**
 * @swagger
 * /instructor/{id}:
 *   delete:
 *     summary: Delete an instructor by ID
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: Unique identifier of the instructor
 *     responses:
 *       200:
 *         description: Instructor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructor deleted successfully"
 *       404:
 *         description: Instructor not found
 *       500:
 *         description: Server error
 */
instructorRouter.delete("/:id", async (req: Request, res: Response) => {
  instructorController.deleteInstructor(req, res);
});

/**
 * @swagger
 * /instructor:
 *   delete:
 *     summary: Delete all instructors
 *     tags: [Instructors]
 *     responses:
 *       200:
 *         description: All instructors deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All instructors deleted successfully"
 *       500:
 *         description: Server error
 */
instructorRouter.delete("/", async (req: Request, res: Response) => {
  instructorController.deleteAllInstructors(req, res);
});

export default instructorRouter;