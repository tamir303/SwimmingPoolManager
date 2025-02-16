import ID from "../Id.dto";
import { SwimmingType } from "../lesson/SwimmingTypes.enum";
import { Preferences } from "./Preferences.dto";

export default class Student {
    constructor(
        public id: ID,
        public password: string,
        public LessonTypePreferences: Preferences,
        public SwimmingTypesPreferences: SwimmingType[]
    ) {}
}