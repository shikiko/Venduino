import React from 'react';
import { Layout, Text, withStyles } from 'react-native-ui-kitten';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  NearbyMachines as MachineMap,
  MachinePointProps,
} from '@src/components/app';
import { Button, Separator } from '@src/components/common';

dayjs.extend(relativeTime);

const TransactionsDetailsComponent = ({
  themedStyle,
  navigation,
  route,
}: any) => {
  const {
    transaction: {
      item_name: name,
      price,
      quantity,
      latitude,
      longitude,
      address,
      name: machineName,
      machine_id: machineId,
      timestamp,
    },
  } = route.params;
  return (
    <>
      <Layout style={themedStyle.container}>
        <Layout style={themedStyle.topContainer}>
          <Layout style={themedStyle.titleContainer}>
            <Text style={themedStyle.title} category="h1">
              {name}
            </Text>
            <Text style={themedStyle.quantity}>{`x${quantity}`}</Text>
          </Layout>
          <Text appearance="hint">
            {dayjs(timestamp).format(
              `H:mm A - D MMM ${
                dayjs(timestamp).isSame(dayjs(), 'year') ? '' : 'YY'
              }`,
            )}
          </Text>
          <Layout>
            <Text style={themedStyle.price} category="h1">{`$${price}`}</Text>
          </Layout>
        </Layout>

        <Layout style={themedStyle.separatorContainer}>
          <Separator style={themedStyle.separator} text="Location" />
        </Layout>

        <Layout>
          <Text style={themedStyle.machine} category="h6">
            {machineName}
          </Text>
          <Text style={themedStyle.text}>{address}</Text>
          <Layout style={themedStyle.mapContainer}>
            <MachineMap
              data={[
                {
                  id: machineId,
                  title: machineName,
                  description: address,
                  location: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                  },
                },
              ]}
            />
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default withStyles(TransactionsDetailsComponent, theme => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  topContainer: {
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  quantity: {
    color: theme['text-disabled-color'],
    marginRight: 4,
  },
  time: {
    color: theme['text-hint-color'],
  },
  title: {
    color: theme['text-basic-color'],
  },
  price: {
    fontWeight: 'normal',
    color: theme['color-primary-default'],
  },
  mapContainer: {
    marginVertical: 16,
    height: 128,
  },
  separatorContainer: {
    alignItems: 'center',
  },
  separator: {
    width: 128,
    marginTop: 48,
    marginBottom: 32,
  },
}));
