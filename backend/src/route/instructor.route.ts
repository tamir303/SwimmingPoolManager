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
 *       properties:
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2025-01-16T09:00:00Z"
 *           description: Start time in ISO 8601 format (UTC).
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2025-01-16T17:00:00Z"
 *           description: End time in ISO 8601 format (UTC).
 *     Availability:
 *       type: array
 *       items:
 *         oneOf:
 *           - type: integer
 *             example: -1
 *             description: Indicates unavailability for the day.
 *           - $ref: '#/components/schemas/StartAndEndTime'
 *       description: Array of 7 entries representing availability for each day of the week (0-Sunday, 6-Saturday).
 *       example: [
 *         -1,
 *         -1,
 *         { "startTime": "2025-01-16T09:00:00Z", "endTime": "2025-01-16T17:00:00Z" },
 *         -1,
 *         -1,
 *         -1,
 *         -1
 *       ]
 *     Instructor:
 *       type: object
 *       properties:
 *         instructorId:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *           description: Unique identifier for the instructor.
 *         name:
 *           type: string
 *           example: "John Doe"
 *           description: Full name of the instructor.
 *         specialties:
 *           type: array
 *           items:
 *             type: string
 *           example: ["BACK_STROKE", "CHEST"]
 *           description: List of specialties the instructor can teach.
 *         availabilities:
 *           $ref: '#/components/schemas/Availability'
 *     NewInstructor:
 *       type: object
 *       required:
 *         - name
 *         - specialties
 *         - availabilities
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *           description: Full name of the new instructor.
 *         specialties:
 *           type: array
 *           items:
 *             type: string
 *           example: ["BACK_STROKE", "CHEST"]
 *           description: List of specialties the new instructor can teach.
 *         availabilities:
 *           $ref: '#/components/schemas/Availability'
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
 *             $ref: '#/components/schemas/NewInstructor'
 *     responses:
 *       201:
 *         description: Instructor successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
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
 *         example: ["BACK_STROKE", "CHEST"]
 *     responses:
 *       200:
 *         description: Successfully retrieved instructors with given specialties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instructor'
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
 *           description: Day of the week (0 for Sunday, 6 for Saturday)
 *           example: 2
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Start time in ISO 8601 format (e.g., "2025-01-16T09:00:00Z")
 *           example: "2025-01-16T09:00:00Z"
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           description: End time in ISO 8601 format (e.g., "2025-01-16T17:00:00Z")
 *           example: "2025-01-16T17:00:00Z"
 *     responses:
 *       200:
 *         description: List of instructors available
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instructor'
 */
instructorRouter.get("/availability", async (req: Request, res: Response) => {
  instructorController.getInstructorsByAvailability(req, res);
});

/**
 * @swagger
 * /instructor/single/{instructorId}:
 *   get:
 *     summary: Get an instructor by ID
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: instructorId
 *         required: true
 *         schema:
 *           type: string
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Successfully retrieved instructor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 */
instructorRouter.get(
  "/single/:instructorId",
  async (req: Request, res: Response) => {
    instructorController.getInstructorById(req, res);
  }
);

/**
 * @swagger
 * /instructor/{instructorId}:
 *   put:
 *     summary: Update an instructor
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: instructorId
 *         required: true
 *         schema:
 *           type: string
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instructor'
 *     responses:
 *       200:
 *         description: Instructor updated successfully
 */
instructorRouter.put(
  "/:instructorId",
  deserializeAvailabilities,
  async (req: Request, res: Response) => {
    instructorController.updateInstructor(req, res);
  }
);

/**
 * @swagger
 * /instructor/{instructorId}:
 *   delete:
 *     summary: Delete an instructor by ID
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: instructorId
 *         required: true
 *         schema:
 *           type: string
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Instructor deleted successfully
 */
instructorRouter.delete(
  "/:instructorId",
  async (req: Request, res: Response) => {
    instructorController.deleteInstructor(req, res);
  }
);

/**
 * @swagger
 * /instructor:
 *   delete:
 *     summary: Delete all instructors
 *     tags: [Instructors]
 *     responses:
 *       200:
 *         description: All instructors deleted successfully
 */
instructorRouter.delete("/", async (req: Request, res: Response) => {
  instructorController.deleteAllInstructors(req, res);
});

export default instructorRouter;
