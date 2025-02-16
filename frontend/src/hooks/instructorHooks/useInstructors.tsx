import { useEffect, useState } from "react"
import Instructor from "../../dto/instructor/instructor.dto"
import InstructorService from "../../services/instructor.service";
import NewInstructor from "../../dto/instructor/new-instructor.dto";
import { Swimming } from "../../utils/swimming-enum.utils";
import { Availability } from "../../dto/instructor/start-and-end-time.dto";

interface NewInstructorParams {
    name: string,
    specialties: Swimming[],
    availabilities: Availability[]
}

interface UpdateInstructorParams {
    id: string,
    data: any
}

interface DeleteInstructorParams {
    id: string,
}

export const useInstructors = () => {
    const [instructors, setInstructors] = useState<Instructor[]>([]);

    const fetchInstructors = async () => {
      const data = await InstructorService.getAllInstructors();
      setInstructors(data);
    };
  
    const addInstructor = async ({ name, specialties, availabilities }: NewInstructorParams) => {
      const newInstructorDTO = new NewInstructor(name, specialties, availabilities)  
      await InstructorService.createInstructor(newInstructorDTO);
      await fetchInstructors();
    };
  
    const updateInstructor = async ({ id, data }: UpdateInstructorParams) => {
      await InstructorService.updateInstructor(id, data);
      await fetchInstructors();
    };
  
    const deleteInstructor = async ({ id }: DeleteInstructorParams) => {
      await InstructorService.deleteInstructorById(id);
      await fetchInstructors();
    };
  
    useEffect(() => {
      fetchInstructors();
    }, []);

    return { instructors, addInstructor, updateInstructor, deleteInstructor, fetchInstructors }
}