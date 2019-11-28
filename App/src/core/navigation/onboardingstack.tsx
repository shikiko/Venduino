import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Dashboard as DashboardScreen } from "@src/containers/layouts";

const Stack = createStackNavigator();

const OnboardingStack = () => (
  <Stack.Navigator initialRouteName="Step1" screenOptions={{}}>
    <Stack.Screen name="Step1" component={DashboardScreen} />
  </Stack.Navigator>
);

export default OnboardingStack;
