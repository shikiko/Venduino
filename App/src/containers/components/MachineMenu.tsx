import React from 'react';
import { Dimensions } from 'react-native';
import useSWR, { trigger, mutate } from 'swr';
import {
  Layout,
  withStyles,
  ThemedComponentProps,
  Text,
} from 'react-native-ui-kitten';

import { Menu as MenuBase } from '@src/components/app';
import { MachineService } from '@src/core/services';

export type MachineMenuProps = ThemedComponentProps & {
  navigation: any;
  route: any;
};

export const fetchInventory = async (machineId: any) => {
  console.log('fetch inv', machineId);
  const res = await MachineService.fetchInventory({ machineId });
  return res;
};

const MachineMenu = ({
  themedStyle,
  navigation,
  route,
  ...props
}: MachineMenuProps) => {
  const { machineId } = route.params;
  const { data: user } = useSWR('/api/user/profile');
  const { data, isValidating } = useSWR(
    `/api/machine/${machineId}/inventory`,
    () => fetchInventory(machineId),
    {
      refreshInterval: 10000,
    },
  );
  const { machine, data: items } = data || {};
  const onOrder = async (item: any) => {
    navigation.navigate('Main');
    navigation.navigate('Dashboard');
    navigation.navigate('Home');
    console.log('onOrder', item);
    const quantity = 1;
    const price = quantity * item.price;
    if (user.balance - price >= 0) {
      const res = await MachineService.buy({
        machine_id: machineId,
        item_id: item.item_id,
        quantity,
      });

      trigger(`/api/machine/${machineId}/inventory`);
      mutate('/api/user/profile', {
        ...user,
        balance: user.balance - price,
      });
    }
  };

  return (
    <>
      <Layout style={themedStyle.listContainer}>
        {machine && (
          <Text style={themedStyle.subtitle}>
            {`${machine.name},\n${machine.address}`}
          </Text>
        )}
        <Layout style={themedStyle.menuContainer}>
          <MenuBase
            {...props}
            data={items}
            loading={isValidating}
            onOrder={onOrder}
            onRefresh={() => trigger(`/api/machine/${machineId}/inventory`)}
          />
        </Layout>
      </Layout>
    </>
  );
};

export default withStyles(MachineMenu, theme => ({
  listContainer: {
    // flex: 1,
    height: Dimensions.get('window').height,
  },
  menuContainer: {
    marginTop: 16,
  },
  subtitle: {
    fontWeight: 'bold',
    color: theme['text-hint-color'],
  },
}));
