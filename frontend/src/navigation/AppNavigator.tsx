import React, { ReactNode } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";

export type AppScreen = {  
    name: string,
    component: React.FC<any>  
}

interface AppNavigatorProps {
    initialRouteName: string,
    screenOptions: Object,
    screens: AppScreen[]
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ 
    initialRouteName, 
    screenOptions, 
    screens
}) => {
    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName={initialRouteName} 
                screenOptions={screenOptions}
            >
                {screens.map((screen) => (
                    <Stack.Screen
                        key={screen.name}
                        name={screen.name} 
                        component={screen.component} 
                    />
                ))}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator