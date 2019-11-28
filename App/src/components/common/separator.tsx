import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { withStyles, ThemedComponentProps, Text } from "react-native-ui-kitten";

export type SeparatorProps = ThemedComponentProps & {
  text?: string;
  style: StyleProp<ViewStyle>;
};

const SeparatorComponent = ({
  themedStyle,
  style,
  text,
  ...props
}: SeparatorProps) => {
  return (
    <View style={[themedStyle.line, style]} {...props}>
      {text && <Text style={themedStyle.label}>{text}</Text>}
    </View>
  );
};

export const Separator = withStyles(SeparatorComponent, theme => ({
  line: {
    height: 1,
    backgroundColor: theme["background-basic-color-3"]
  },
  label: {
    color: theme["text-hint-color"]
  }
}));
