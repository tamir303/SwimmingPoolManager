import express from "express";
import { Request, Response } from "express";
import StudentController from "../controller/student.controller.js"

const studentRouter = express.Router();
const studentController = new StudentController();

/**
 * @swagger
 * tags:
 *   - name: Students
 *     description: Student management APIs
 *
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "Jane Doe"
 *         preferences:
 *           type: array
 *           items:
 *             type: string
 *           example: ["CHEST", "BACK_STROKE"]
 *
 *     NewStudent:
 *       type: object
 *       required:
 *         - name
 *         - preferences
 *       properties:
 *         name:
 *           type: string
 *           example: "Jane Doe"
 *         preferences:
 *           type: array
 *           items:
 *             type: string
 *           example: ["CHEST", "BACK_STROKE"]
 *
 *     LoginStudent:
 *       type: object
 *       required:
 *         - id
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         password:
 *           type: string
 *           example: "yourpassword"
 */

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       description: Student object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewStudent'
 *     responses:
 *       201:
 *         description: Student created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       500:
 *         description: Server error.
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
 *       description: Login credentials for a student.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginStudent'
 *     responses:
 *       200:
 *         description: Student logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized. Incorrect credentials.
 *       500:
 *         description: Server error.
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
 *         description: Unique identifier of the student.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Server error.
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
 *         description: Unique identifier of the student to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated student data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Server error.
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
 *         description: Unique identifier of the student to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully.
 *       500:
 *         description: Server error.
 */
studentRouter.delete("/:id", async (req: Request, res: Response) => {
  studentController.deleteStudent(req, res);
});

export default studentRouter;
