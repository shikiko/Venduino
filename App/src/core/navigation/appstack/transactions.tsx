import React from 'react';
import { withStyles, ThemedComponentProps } from 'react-native-ui-kitten';

import { createStackNavigator } from '@react-navigation/stack';

import {
  Transactions as TransactionsScreen,
  TransactionsDetail as TransactionsDetailScreen,
} from '@src/containers/layouts';
import { AppLogo } from '@src/assets/icons';

const Stack = createStackNavigator();
type Props = ThemedComponentProps & {};
const Title = (): React.ReactElement => <AppLogo height={32} width={150} />;

const TransactionsStackScreenUnstyled = ({ themedStyle }: Props) => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerBackTitleStyle: {
        color: themedStyle.color.text,
      },
      headerTintColor: themedStyle.color.text, // back button
      headerTitle: () => <Title />,
      headerBackTitleVisible: false,
    }}>
    <Stack.Screen
      name="Home"
      component={TransactionsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TransactionsDetail"
      component={TransactionsDetailScreen}
    />
  </Stack.Navigator>
);

export default withStyles(TransactionsStackScreenUnstyled, theme => ({
  color: {
    primary: theme['color-primary-default'],
    text: theme['text-basic-color'],
    hint: theme['text-hint-color'],
    background: theme['background-basic-color-2'],
  },
}));
