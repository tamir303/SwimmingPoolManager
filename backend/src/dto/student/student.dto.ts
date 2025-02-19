import { IStudent } from "../../model/student.model.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";

/**
 * Student Class
 *
 * Represents a student enrolled in a swimming lesson, including their name and swimming preferences.
 */
export default class Student {
  /**
   * Constructor for Student.
   * @param id - The unique identifier for the student.
   * @param name - The name of the student.
   * @param preferences - The swimming preferences (e.g., [Swimming.CHEST, Swimming.BACK_STROKE]).
   */
  constructor(
    public id: string,
    public name: string,
    public preferences: Swimming[],
    public password: string
  ) {}

  // Convert a Mongoose model document to a Student instance.
  static fromModel(model: IStudent): Student {
    return new Student(model._id, model.name, model.preferences, model.password);
  }

  // Convert a Student instance to an object suitable for saving in MongoDB.
  static toModel(student: Student): any {
    return {
      _id: student.id,
      name: student.name,
      preferences: student.preferences,
      password: student.password
    };
  }
}
