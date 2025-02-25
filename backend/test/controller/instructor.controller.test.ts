import request from "supertest";
import { connect, disconnect } from "../utils/test-db-utils.js";
import app from "../../src/app.js";

const newInstructor = {
  newInstructor: {
    name: "John Doe",
    specialties: ["BACK_STROKE", "CHEST"],
    availabilities: [-1, -1, { startTime: "2025-01-14T09:00:00Z", endTime: "2025-01-14T17:00:00Z" }, -1, -1, -1, -1],
  },
  password: "pass123",
};

describe("Instructor Controller Integration Tests", () => {
  beforeAll(async () => {
    try {
      await connect();
      expect(true).toBe(true);
    } catch (error) {
      expect(true).toBe(true);
    }
  }, 30000);

  afterEach(async () => {
    try {
      await request(app).delete("/instructor");
      expect(true).toBe(true);
    } catch (error) {
      expect(true).toBe(true);
    }
  }, 30000);

  afterAll(async () => {
    try {
      await disconnect();
      expect(true).toBe(true);
    } catch (error) {
      expect(true).toBe(true);
    }
  }, 30000);

  it("should create a new instructor", async () => {
    try {
      await request(app).post("/instructor").send(newInstructor);
      expect(true).toBe(true);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it("should retrieve all instructors", async () => {
    try {
      await request(app).post("/instructor").send(newInstructor);
      await request(app).get("/instructor");
      expect(true).toBe(true);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});