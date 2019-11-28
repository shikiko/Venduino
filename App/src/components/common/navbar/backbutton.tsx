import React from "react";
import {
  withStyles,
  ThemeType,
  Text,
  Layout as View,
  ThemedComponentProps
} from "react-native-ui-kitten";
import { ViewProps } from "react-native";

import { Touchable } from "@src/components/common";
import { CaretIcon } from "@src/assets/icons";

export type BackButtonProps = ThemedComponentProps & ViewProps;

const BackButtonComponent = ({ themedStyle, ...props }: BackButtonProps) => (
  <Touchable {...props}>
    <View style={themedStyle.container}>
      <CaretIcon height={16} width={16} color={themedStyle.text.color} />
      <Text style={themedStyle.text}>Back</Text>
    </View>
  </Touchable>
);

export default withStyles(BackButtonComponent, (theme: ThemeType) => ({
  container: { flexDirection: "row", alignItems: "center" },
  text: {
    color: theme["text-basic-color"],
    marginLeft: 8
  }
}));
