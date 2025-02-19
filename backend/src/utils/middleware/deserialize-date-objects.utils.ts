import { Request, Response, NextFunction } from "express";
import { Availability } from "../../dto/instructor/start-and-end-time.dto.js";
import { createCustomLogger } from "../../etc/logger.etc.js";
import path from "path";

// Initialize logger
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

/**
 * Middleware to deserialize `availabilities` in the request body.
 * Converts `startTime` and `endTime` fields in each availability entry to `Date` objects
 * for proper handling within the application.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the chain.
 */
const deserializeAvailabilities = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  // Check if the body contains `availabilities`
  if (body && Array.isArray(body.newInstructor.availabilities)) {
    body.newInstructor.availabilities = body.newInstructor.availabilities.map(
      (availability: Availability) => {
        if (typeof availability === "object" && availability !== null) {
          // Convert `startTime` and `endTime` to `Date` objects
          return {
            ...availability,
            startTime: new Date(availability.startTime),
            endTime: new Date(availability.endTime),
          };
        }
        return availability; // Preserve non-object entries like -1
      }
    );
  }

  next(); // Proceed to the next middleware or route handler
};

export default deserializeAvailabilities;
