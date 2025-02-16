import ID from "../Id.dto"
import { SwimmingType } from "../lesson/SwimmingTypes.enum"
import Availability from "../TimeSettings.dto"

export default class NewInstructor {
    constructor(
        public id: ID,
        public password: string,
        public availability: Availability[],
        public swimmings: SwimmingType[],
    ) {}
}