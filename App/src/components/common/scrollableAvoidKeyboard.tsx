import React from "react";
import { withStyles } from "react-native-ui-kitten";
import {
  KeyboardAwareScrollView,
  KeyboardAwareProps
} from "react-native-keyboard-aware-scroll-view";

interface State {
  style: any;
  contentContainerStyle: any;
  themedStyle: any;
}

const ScrollableAvoidKeyboardComponent = ({
  style,
  contentContainerStyle,
  themedStyle,
  ...restProps
}: State & KeyboardAwareProps) => {
  return (
    <KeyboardAwareScrollView
      bounces={false}
      bouncesZoom={false}
      alwaysBounceVertical={false}
      alwaysBounceHorizontal={false}
      style={[themedStyle.container, style]}
      contentContainerStyle={[
        themedStyle.contentContainer,
        contentContainerStyle
      ]}
      enableOnAndroid
      {...restProps}
    />
  );
};

export const ScrollableAvoidKeyboard = withStyles(
  ScrollableAvoidKeyboardComponent,
  () => ({
    container: {
      flex: 1
    },
    contentContainer: {
      flexGrow: 1
    }
  })
);
