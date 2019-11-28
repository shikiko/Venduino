import React from "react";
import {
  Layout,
  Text,
  withStyles,
  ThemedComponentProps
} from "react-native-ui-kitten";
import { useSafeArea } from "react-native-safe-area-context";

import { BarcodeScanner } from "@src/components/common";

export type Props = ThemedComponentProps & any;

const ScannerComponent = ({ themedStyle, navigation }: Props) => {
  const insets = useSafeArea();
  return (
    <>
      <BarcodeScanner
        onBarcode={(barcode: any) => {
          // console.log(barcode);
          // data machineId validation
          if (barcode.data !== " ") {
            navigation.navigate("MachineMenu", {
              barcode,
              machineId: barcode.data
            });
          }
        }}
      />
      <Layout style={[themedStyle.container, { paddingBottom: insets.bottom }]}>
        <Text style={themedStyle.text} category="h6">
          Scan QR Code
        </Text>
        <Text style={themedStyle.text} category="s1" appearance="hint">
          Point your camera to scan a QR Code for an Venduino machine
        </Text>
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
  }
}));
