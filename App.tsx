import React from 'react';
import Login from './app/screens/Login';
import Home from './app/screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SessionTest from './app/screens/SessionTest';
import Draw from './app/screens/Draw';
import { RootStackParamList } from './app/types/NavigationTypes';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown:false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown:false }} />
        <Stack.Screen name="SessionTest" component={SessionTest} />
        <Stack.Screen name="Draw" component={Draw} options={{ headerShown:false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
