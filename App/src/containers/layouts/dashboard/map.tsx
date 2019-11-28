import React, { useState } from "react";
import useSWR from "swr";
import {
  Layout,
  Text,
  withStyles,
  ThemedComponentProps,
  Button
} from "react-native-ui-kitten";
import { useSafeArea } from "react-native-safe-area-context";

import { NearbyMachines, MachinePointProps } from "@src/components/app";
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

export type Props = ThemedComponentProps & any;

const DEFAULT_MARKER = {
  id: null,
  title: "No point selected",
  description: "Select a vending machine to continue"
};

const ScannerComponent = ({ themedStyle, navigation }: Props) => {
  const { data: machines } = useSWR("/api/machine", fetchMachines);

  const [marker = DEFAULT_MARKER, setMarker] = useState<MachinePointProps>();
  const insets = useSafeArea();
  const onPressMarker = (pressedMarker: MachinePointProps) => {
    setMarker(pressedMarker || DEFAULT_MARKER);
  };
  return (
    <>
      <NearbyMachines onPressMarker={onPressMarker} data={machines} />
      <Layout style={[themedStyle.container, { paddingBottom: insets.bottom }]}>
        <Text style={themedStyle.text} category="h6">
          {marker.title}
        </Text>
        <Text style={themedStyle.text} category="s1" appearance="hint">
          {marker.description}
        </Text>
        {marker.id && (
          <Button
            style={themedStyle.button}
            onPress={() => {
              console.log(marker);
              navigation.navigate("MachineMenu", {
                marker,
                machineId: marker.id
              });
            }}
          >
            Buy item
          </Button>
        )}
      </Layout>
    </>
  );
};

export default withStyles(ScannerComponent, theme => ({
  container: {
    flex: 0.5,
    padding: 16,
    justifyContent: "center"
  },
  text: {
    textAlign: "center"
  },
  button: {
    marginTop: 16
  }
}));
