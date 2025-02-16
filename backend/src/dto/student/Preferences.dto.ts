import { LessonType } from "../lesson/LessonType.dto";

export abstract class Preferences { }

export class SinglePreference extends Preferences {
    constructor(public preference: LessonType) {
        super();
    }
}

export class MultiplePreferences extends Preferences {
    constructor(public preferences: LessonType[]) {
        super();
    }
}

export default { SinglePreference, MultiplePreferences, Preferences }