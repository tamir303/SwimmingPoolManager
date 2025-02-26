import { LessonType } from "../../utils/lesson-enum.utils.js";


export default class TypePreference {
    constructor(
        public preference: LessonType,
        public priority1: LessonType | null,
        public priority2: LessonType | null,
    ) {}
}