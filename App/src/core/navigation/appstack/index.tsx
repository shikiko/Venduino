import React from "react";
import { withStyles, ThemedComponentProps } from "react-native-ui-kitten";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createStackNavigator } from "@react-navigation/stack";

import {
  Account as AccountScreen,
  MachineMenu as MachineMenuScreen
} from "@src/containers/layouts";
import {
  AccountsIcon,
  TransactionsIcon,
  DashboardIcon
} from "@src/assets/icons";
import DashboardStack from "./dashboard";
import TransactionsStack from "./transactions";

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

type Props = ThemedComponentProps & {};

const AppTabComponent = ({ themedStyle }: Props) => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      tabBarOptions={{
        activeTintColor: themedStyle.color.primary,
        inactiveTintColor: themedStyle.color.hint,
        inactiveBackgroundColor: themedStyle.color.background,
        activeBackgroundColor: themedStyle.color.background,
        showLabel: false,
        style: {
          backgroundColor: themedStyle.color.background // bottom safe area color
        }
      }}
    >
      <Tab.Screen
        name="Transactions"
        component={TransactionsStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TransactionsIcon height={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <DashboardIcon height={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AccountsIcon height={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const AppTabScreen = withStyles(AppTabComponent, theme => ({
  color: {
    primary: theme["color-primary-default"],
    hint: theme["text-hint-color"],
    background: theme["background-basic-color-2"]
  }
}));

// For modals
const RootStackScreen = ({ themedStyle }: Props) => (
  <RootStack.Navigator
    mode="modal"
    screenOptions={{
      headerTitle: "",
      headerTintColor: themedStyle.color.text // back button
      // headerBackTitleVisible: false,
    }}
  >
    <RootStack.Screen
      name="Main"
      component={AppTabScreen}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="MachineMenu"
      component={MachineMenuScreen}
      options={{ headerShown: true }}
    />
  </RootStack.Navigator>
);

export default withStyles(RootStackScreen, theme => ({
  color: {
    primary: theme["color-primary-default"],
    hint: theme["text-hint-color"],
    text: theme["text-basic-color"],
    background: theme["background-basic-color-2"]
  }
}));
