import { Request, Response, NextFunction } from "express";
import { Availability } from "../../dto/instructor/start-and-end-time.dto.js";
import { createCustomLogger } from "../../etc/logger.etc.js";
import path from "path";

const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

const deserializeAvailabilities = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  if (body) {
    // If availabilities exist under newInstructor, process them.
    if (body.newInstructor && Array.isArray(body.newInstructor.availabilities)) {
      logger.info("Deserializing availabilities from newInstructor");
      body.newInstructor.availabilities = body.newInstructor.availabilities.map(
        (availability: Availability) => {
          if (typeof availability === "object" && availability !== null) {
            return {
              ...availability,
              startTime: new Date(availability.startTime),
              endTime: new Date(availability.endTime),
            };
          }
          return availability;
        }
      );
    }
    // Otherwise, if availabilities exist at the root of the body, process those.
    else if (Array.isArray(body.availabilities)) {
      logger.info("Deserializing availabilities from root body");
      body.availabilities = body.availabilities.map((availability: Availability) => {
        if (typeof availability === "object" && availability !== null) {
          return {
            ...availability,
            startTime: new Date(availability.startTime),
            endTime: new Date(availability.endTime),
          };
        }
        return availability;
      });
    }
  }
  next();
};

export default deserializeAvailabilities;
