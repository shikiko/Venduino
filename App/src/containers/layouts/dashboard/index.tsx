import React from 'react';
import { View } from 'react-native';
import { Layout, Text, withStyles } from 'react-native-ui-kitten';

import { Button, Touchable } from '@src/components/common';
import { QRCodeIcon } from '@src/assets/icons';
import { textStyle } from '@src/core/themes';
import {
  BalanceCard,
  NearbyMachines,
  RecentTransactions,
} from '@src/containers/components';

const DashboardComponent = ({ themedStyle, navigation }: any) => {
  return (
    <>
      <Layout style={themedStyle.headerContainer}>
        <Text style={themedStyle.helloLabel} category="h1">
          Good morning
        </Text>
        <Touchable
          onPress={() => {
            navigation.navigate('Scanner');
          }}
          feedback="opacity">
          <Layout style={themedStyle.scanContainer}>
            <QRCodeIcon color={themedStyle.color.icon} height={64} />
            <Text style={themedStyle.action}>Scan QR</Text>
          </Layout>
        </Touchable>
      </Layout>

      <Layout style={themedStyle.container}>
        <BalanceCard
          onTopup={() => {
            navigation.navigate('Topup');
          }}
        />
        <Touchable
          onPress={() => {
            navigation.navigate('MachineMap');
          }}>
          <View>
            <NearbyMachines />
          </View>
        </Touchable>

        <RecentTransactions />
      </Layout>
    </>
  );
};

export { default as Scanner } from './scanner';
export { default as MachineMap } from './map';

export const Dashboard = withStyles(DashboardComponent, theme => ({
  action: textStyle.action,
  color: {
    icon: theme['text-basic-color'],
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme['background-basic-color-2'],
  },
  headerContainer: {
    padding: 16,
    paddingBottom: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helloLabel: {
    marginBottom: 32,
  },
  scanContainer: {
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
  },
}));
