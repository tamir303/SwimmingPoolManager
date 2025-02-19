import React from "react";
import MainScreen from "./src/screens/InstructorScreens/InstructorMainScreen";
import InstructorScreen from "./src/screens/InstructorScreens/InstructorSettingScreen";
import CalendarScreen from "./src/screens/InstructorScreens/InstructorCalendarScreen";
import AppNavigator, { AppScreen } from "./src/navigation/AppNavigator";
import RegisterLoginScreen from "./src/screens/RegisterLoginScreen";
import { AuthProvider } from "./src/hooks/authContext";

const AppScreens: AppScreen[] = [
  { name: "LoginRegisterScreen", component: RegisterLoginScreen },
  { name: "InstructorMainScreen", component: MainScreen },
  { name: "InstructorSettingScreen", component: InstructorScreen },
  { name: "InstructorCalendarScreen", component: CalendarScreen }
]

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigator initialRouteName="LoginRegisterScreen" screens={AppScreens} screenOptions={{ headerShown: false }}/>
    </AuthProvider>
  );
};

export default App;
