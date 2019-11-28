import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationNativeContainer } from "@react-navigation/native";

import { AuthLoadingScreen } from "@src/components/auth";

import AppStack from "./appstack";
import AuthStack from "./authstack";
import OnboardingStack from "./onboardingstack";

const Stack = createStackNavigator();

const Routes = () => (
  <Stack.Navigator
    initialRouteName="AuthLoader"
    headerMode="none"
    screenOptions={{
      gestureEnabled: false
    }}
  >
    <Stack.Screen name="AuthLoader" component={AuthLoadingScreen} />
    <Stack.Screen name="Auth" component={AuthStack} />
    <Stack.Screen name="Onboarding" component={OnboardingStack} />
    <Stack.Screen name="App" component={AppStack} />
  </Stack.Navigator>
);

export const Router = (props: any) => (
  <NavigationNativeContainer {...props}>
    <Routes />
  </NavigationNativeContainer>
);
