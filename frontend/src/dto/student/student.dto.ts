import { Swimming } from "../../utils/swimming-enum.utils.js";
import TypePreference from "./typePreference.dto.js";

/**
 * Student Class
 *
 * Represents a student enrolled in a swimming lesson, including their name, swimming preferences, and contact information.
 *
 * @param {string} id - The unique identifier for the instructor. Can be `null` for new instructors.
 * @param {string} name - The name of the student.
 * @param {Swimming[]} preferences - The swimming styles preferred by the student (e.g., chest, backstroke). Defined in the `Swimming` enum.
 *  @param {Swimming[]} typePreference 
 */
export default class Student {
  /**
   * Constructor for the Student class
   * 
   * @param {string} id - The unique identifier for the instructor. Can be `null` for new instructors.
   * @param {string} name - The name of the student.
   * @param {Swimming[]} preferences - The swimming styles preferred by the student.
   * @param {Swimming[]} typePreference 
   */
  constructor(
    public id: string,
    public name: string,
    public preferences: Swimming[], // e.g., [Swimming.CHEST, Swimming.BACK_STROKE]
    public typePreference: TypePreference
  ) {}
}
