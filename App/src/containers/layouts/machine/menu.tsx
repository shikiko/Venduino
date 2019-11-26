import React from 'react';
import { Layout, Text, withStyles } from 'react-native-ui-kitten';

import { MachineMenu } from '@src/containers/components';

const MenuComponent = ({ themedStyle, route, navigation }: any) => {
  return (
    <>
      <Layout style={themedStyle.container}>
        <Text style={themedStyle.title} category="h1">
          Dispense an item
        </Text>

        <Layout style={themedStyle.menuContainer}>
          <MachineMenu route={route} navigation={navigation} />
        </Layout>
      </Layout>
    </>
  );
};

export default withStyles(MenuComponent, theme => ({
  container: {
    flex: 1,
    padding: 16,
  },
  illustrationContainer: {
    marginBottom: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {},
  buttonSpace: {
    marginTop: 16,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
  },
}));
