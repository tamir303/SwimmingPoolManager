import StudentRepositoryInterface from "./IStudent.repository.js";
import StudentModel, { IStudent } from "../../model/student.model.js";
import Student from "../../dto/student/student.dto.js";

export default class StudentRepository implements StudentRepositoryInterface {
  async create(studentData: Student): Promise<Student> {
    const newStudent = new StudentModel(Student.toModel(studentData));
    const savedStudent = await newStudent.save();
    return Student.fromModel(savedStudent);
  }

  async findAll(): Promise<Student[]> {
    const studentDocs = await StudentModel.find();
    return studentDocs.map((doc) => Student.fromModel(doc));
  }

  async findById(studentId: string): Promise<Student | null> {
    const doc = await StudentModel.findOne({ _id: studentId });
    return doc ? Student.fromModel(doc) : null;
  }

  async update(studentId: string, studentData: Student): Promise<Student | null> {
    const updatedDoc = await StudentModel.findOneAndUpdate(
      { _id: studentId },
      { name: studentData.name, preferences: studentData.preferences, typePreference: studentData.typePreference },
      { new: true }
    );
    return updatedDoc ? Student.fromModel(updatedDoc) : null;
  }

  async delete(studentId: string): Promise<boolean> {
    const result = await StudentModel.deleteOne({ _id: studentId });
    return result.deletedCount > 0;
  }

  async deleteAll(): Promise<boolean> {
    const result = await StudentModel.deleteMany({});
    return result.deletedCount > 0;
  }
}
