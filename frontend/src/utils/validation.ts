import { Availability } from "../dto/instructor/start-and-end-time.dto";
import { Swimming } from "../utils/swimming-enum.utils";

export const isInstructorValid = (
  name: string,
  specialties: Swimming[],
  availabilities: Availability[]
): { valid: boolean; message?: string } => {
  if (!availabilities.some((a) => a !== -1)) {
    return {
      valid: false,
      message: "The instructor must work at least one day during the week.",
    };
  }
  if (specialties.length === 0) {
    return { valid: false, message: "The instructor must have some specialty." };
  }
  if (name.trim().length === 0) {
    return { valid: false, message: "The instructor must have a name." };
  }
  return { valid: true };
};
