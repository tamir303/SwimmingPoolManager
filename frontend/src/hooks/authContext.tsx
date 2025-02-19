import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
  } from "react";
  import InstructorService from "../services/instructor.service";
  import Instructor from "../dto/instructor/instructor.dto";
import Student from "../dto/student/student.dto";
import StudentService from "../services/student.service";
  
  /**
   * Represents the user type in the system.
   * Could be 'instructor' or 'student'.
   */
  type UserType = "Instructor" | "Student";
  
  /**
   * Minimal user model that includes userType,
   * phone, name, and optionally an ID if the backend returns one.
   */
  interface AuthUser {
    id?: string;
    name: string;
    userType: UserType;
  }
  
  /**
   * AuthContextProps defines the shape of our AuthContext.
   */
  interface AuthContextProps {
    user: AuthUser | null;
    login: (phone: string, password: string) => Promise<void>;
    register: (
      name: string,
      phone: string,
      password: string,
      userType: UserType
    ) => Promise<void>;
    logout: () => void;
    isInstructor: boolean;
  }
  
  /**
   * Default values for the context. Usually set to no-ops or nulls.
   */
  const AuthContext = createContext<AuthContextProps>({
    user: null,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    isInstructor: false,
  });
  
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  /**
   * AuthProvider is our context provider that wraps the app.
   * It manages the user's authentication state.
   */
  export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
  
    /**
     * Example login function.
     * In a real app, you would call your backend with phone/password to get:
     *  1) A token (JWT or similar)
     *  2) User details (name, id, userType)
     */
    const login = async (
      phone: string,
      password: string,
    ): Promise<void> => {
      var flag = true
      try {
        await StudentService.getStudentById(phone);
      } catch (err) {
        flag = false
      }

      try {
        // Try to fetch a student by phone (assuming phone is used as the student ID)
        if (flag) {
          // Student exists: login as student.
          const studentData: Student = await StudentService.loginStudent(phone, password);
          setUser({
            id: studentData.id,
            name: studentData.name,
            userType: "Student",
          });
        } else {
          // No student found: assume it's an instructor.
          const instructorData: Instructor = await InstructorService.loginInstructor(phone, password);
          setUser({
            id: instructorData.id,
            name: instructorData.name,
            userType: "Instructor",
          });
        }
    
        // Optionally: store token in AsyncStorage, Redux, or similar.
      } catch (err) {
        console.error("Login error:", err);
        throw err;
      }
    };    
  
    /**
     * Example register function.
     * You would call a /register endpoint in a real app.
     * If the user is an instructor, you might create them via InstructorService.
     */
    const register = async (
      name: string,
      phone: string,
      password: string,
      userType: UserType
    ): Promise<void> => {
      try {
        // For demonstration, let's say if userType is "instructor",
        // we create them via InstructorService:
        if (userType === "Instructor") {
          const newInstructor: Instructor = {
            id: phone,
            name,
            specialties: [],
            availabilities: [],
          };
          const createdInstructor = await InstructorService.createInstructor(
            password,
            newInstructor
        );

          setUser({
            id: phone,
            name,
            userType: "Instructor",
          });

        } else {
          const newStudent: Student = {
            id: phone,
            name,
            preferences: []
          };
          const createdStudent: Student = await StudentService.createStudent(
            password,
            newStudent
          );
          setUser({
            id: phone,
            name,
            userType: "Student",
          });
        }
        // In a real app, store token or relevant info here
      } catch (err) {
        console.error("Register error:", err);
        throw err;
      }
    };
  
    /**
     * Clear user state on logout.
     * Also remove any tokens from storage if needed.
     */
    const logout = () => {
      setUser(null);
      // e.g. AsyncStorage.removeItem("token");
    };
  
    const isInstructor = user?.userType === "Instructor";
  
    return (
      <AuthContext.Provider
        value={{
          user,
          login,
          register,
          logout,
          isInstructor,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  /**
   * Convenience hook for consuming our AuthContext
   */
  export const useAuth = () => useContext(AuthContext);
  