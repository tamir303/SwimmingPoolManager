import mongoose, { Schema, Document, Model } from "mongoose";
import { Swimming } from "../utils/swimming-enum.utils.js";

export interface IStudent extends Document {
  _id: string;
  name: string;
  preferences: Swimming[];
  password: string;
}

const StudentSchema: Schema<IStudent> = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    preferences: {
      type: [String],
      enum: Object.values(Swimming),
      required: true,
    },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

const StudentModel: Model<IStudent> = mongoose.model<IStudent>("Student", StudentSchema);

export default StudentModel;
