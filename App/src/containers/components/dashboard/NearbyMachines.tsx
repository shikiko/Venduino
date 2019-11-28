import React from "react";
import useSWR from "swr";
import {
  Layout,
  Text,
  withStyles,
  ThemedComponentProps
} from "react-native-ui-kitten";

import {
  NearbyMachines as NearbyMachinesBase,
  MachinePointProps
} from "@src/components/app";
import { MachineService } from "@src/core/services";

export const fetchMachines = async () => {
  const res = await MachineService.fetchAll();
  return res.data.map((machine: any) => ({
    // ...machine,
    id: machine.machine_id,
    title: machine.name,
    description: machine.address,
    location: {
      latitude: parseFloat(machine.latitude),
      longitude: parseFloat(machine.longitude)
    }
  }));
};

export type NearbyMachinesProps = ThemedComponentProps;

const NearbyMachines = ({ themedStyle, ...props }: NearbyMachinesProps) => {
  const { data: machines } = useSWR("/api/machine", fetchMachines);

  return (
    <>
      <Text category="h6" style={themedStyle.label}>
        Machines nearby
      </Text>
      <Layout style={themedStyle.mapContainer}>
        <NearbyMachinesBase {...props} loading={!machines} data={machines} />
      </Layout>
    </>
  );
};

export default withStyles(NearbyMachines, theme => ({
  mapContainer: {
    height: 128
  },
  label: {
    marginVertical: 16
  }
}));
