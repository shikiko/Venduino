import React from "react";
import { withStyles, ThemedComponentProps } from "react-native-ui-kitten";

import { createStackNavigator } from "@react-navigation/stack";

import {
  Dashboard as DashboardScreen,
  Topup as TopupScreen,
  Scanner as ScannerScreen,
  MachineMap as MachineMapScreen
} from "@src/containers/layouts";
import { AppLogo } from "@src/assets/icons";

const Stack = createStackNavigator();
type Props = ThemedComponentProps & {};
const Title = (): React.ReactElement => <AppLogo height={32} width={150} />;

const DashboardStackScreenUnstyled = ({ themedStyle }: Props) => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerBackTitleStyle: {
        color: themedStyle.color.text
      },
      headerTintColor: themedStyle.color.text, // back button
      headerTitle: () => <Title />,
      headerBackTitleVisible: false
    }}
  >
    <Stack.Screen
      name="Home"
      component={DashboardScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Topup" component={TopupScreen} />
    <Stack.Screen name="Scanner" component={ScannerScreen} />
    <Stack.Screen name="MachineMap" component={MachineMapScreen} />
  </Stack.Navigator>
);

export default withStyles(DashboardStackScreenUnstyled, theme => ({
  color: {
    primary: theme["color-primary-default"],
    text: theme["text-basic-color"],
    hint: theme["text-hint-color"],
    background: theme["background-basic-color-2"]
  }
}));
