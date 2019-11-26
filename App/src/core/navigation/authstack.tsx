import React from 'react';
import { withStyles, ThemedComponentProps } from 'react-native-ui-kitten';
import { createStackNavigator } from '@react-navigation/stack';

import {
  Landing as LandingScreen,
  Signin as SigninScreen,
  Signup as SignupScreen,
} from '@src/containers/layouts';
import { AppLogo } from '@src/assets/icons';

const Title = (): React.ReactElement => <AppLogo height={32} width={150} />;

const Stack = createStackNavigator();
type Props = ThemedComponentProps;

const AuthStack = ({ themedStyle }: Props) => (
  <Stack.Navigator
    initialRouteName="Landing"
    screenOptions={{
      headerBackTitleStyle: {
        color: themedStyle.color.text,
      },
      headerTintColor: themedStyle.color.text, // back button
      headerTitle: () => <Title />,
      headerBackTitleVisible: false,
    }}>
    <Stack.Screen name="Landing" component={LandingScreen} />
    <Stack.Screen name="Signin" component={SigninScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

export default withStyles(AuthStack, theme => ({
  color: {
    primary: theme['color-primary-default'],
    text: theme['text-basic-color'],
    hint: theme['text-hint-color'],
    background: theme['background-basic-color-2'],
  },
}));
