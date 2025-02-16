import { useState } from "react";
import { Swimming } from "../../utils/swimming-enum.utils";
import { DaysOfWeek } from "../../utils/days-week-enum.utils";
import { Availability } from "../../dto/instructor/start-and-end-time.dto";

export const useInstructorForm = () => {
  const [name, setName] = useState("");
  const [specialties, setSpecialties] = useState<Swimming[]>([]);
  const [availableSpecialties, setAvailableSpecialties] = useState(Object.values(Swimming));
  const [availabilities, setAvailabilities] = useState<Availability[]>(Array(7).fill(-1));
  const [availableDays, setAvailableDays] = useState(Object.values(DaysOfWeek));
  const [selectedDay, setSelectedDay] = useState<DaysOfWeek | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const clearForm = () => {
    setName("");
    setSpecialties([]);
    setAvailableSpecialties(Object.values(Swimming));
    setAvailabilities(Array(7).fill(-1));
    setAvailableDays(Object.values(DaysOfWeek));
    setSelectedDay(null);
    setStartTime(null);
    setEndTime(null);
  };

  return {
    name,
    setName,
    specialties,
    setSpecialties,
    availableSpecialties,
    setAvailableSpecialties,
    availabilities,
    setAvailabilities,
    availableDays,
    setAvailableDays,
    selectedDay,
    setSelectedDay,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    clearForm,
  };
};
