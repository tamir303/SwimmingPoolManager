import React from "react";
import MainScreen from "./src/screens/InstructorScreens/InstructorMainScreen";
import InstructorScreen from "./src/screens/InstructorScreens/InstructorSettingScreen";
import CalendarScreen from "./src/screens/InstructorScreens/InstructorCalendarScreen";
import AppNavigator, { AppScreen } from "./src/navigation/AppNavigator";
import RegisterLoginScreen from "./src/screens/RegisterLoginScreen";
import { AuthProvider } from "./src/hooks/authContext";
import StudentMainScreen from "./src/screens/StudentScreens/StudentMainScreen";
import StudentSettingScreen from "./src/screens/StudentScreens/StudentSettingScreen";
import StudentCalendarScreen from "./src/screens/StudentScreens/StudentCalendarScreen";

const AppScreens: AppScreen[] = [
  { name: "LoginRegisterScreen", component: RegisterLoginScreen },
  { name: "InstructorMainScreen", component: MainScreen },
  { name: "InstructorSettingScreen", component: InstructorScreen },
  { name: "InstructorCalendarScreen", component: CalendarScreen },
  { name: "StudentMainScreen", component: StudentMainScreen },
  { name: "StudentSettingScreen", component: StudentSettingScreen },
  { name: "StudentCalendarScreen", component: StudentCalendarScreen }
]

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigator initialRouteName="LoginRegisterScreen" screens={AppScreens} screenOptions={{ headerShown: false }}/>
    </AuthProvider>
  );
};

export default App;
