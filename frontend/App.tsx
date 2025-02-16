import React from "react";
import MainScreen from "./src/screens/InstructorScreens/MainScreen";
import InstructorScreen from "./src/screens/InstructorScreens/InstructorScreen";
import CalendarScreen from "./src/screens/InstructorScreens/CalenderScreen";
import AppNavigator, { AppScreen } from "./src/navigation/AppNavigator";
import RegisterLoginScreen from "./src/screens/RegisterLoginScreen";
import { AuthProvider } from "./src/hooks/authContext";

const AppScreens: AppScreen[] = [
  { name: "LoginRegisterScreen", component: RegisterLoginScreen },
  { name: "MainScreen", component: MainScreen },
  { name: "InstructorScreen", component: InstructorScreen },
  { name: "CalendarScreen", component: CalendarScreen }
]

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigator initialRouteName="LoginRegisterScreen" screens={AppScreens} screenOptions={{}}/>
    </AuthProvider>
  );
};

export default App;
