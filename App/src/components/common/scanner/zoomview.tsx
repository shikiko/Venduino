import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

import {
  PinchGestureHandler,
  State,
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent
} from "react-native-gesture-handler";

const styles = StyleSheet.create({
  preview: {
    height: Dimensions.get("window").height,
    width: "100%"
  }
});

type Props = {
  onPinchProgress: (p: number) => void;
  onPinchStart: () => void;
  onPinchEnd: () => void;
};

export default class ZoomView extends React.Component<any> {
  onGesturePinch = ({ nativeEvent }: PinchGestureHandlerGestureEvent) => {
    this.props.onZoomProgress(nativeEvent.scale);
  };

  onPinchHandlerStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.END) {
      this.props.onZoomEnd();
    } else if (
      event.nativeEvent.oldState === State.BEGAN &&
      event.nativeEvent.state === State.ACTIVE
    ) {
      this.props.onZoomStart();
    }
  };

  render() {
    return (
      <PinchGestureHandler
        onGestureEvent={this.onGesturePinch}
        onHandlerStateChange={this.onPinchHandlerStateChange}
      >
        <View style={[this.props.style, styles.preview]}>
          {this.props.children}
        </View>
      </PinchGestureHandler>
    );
  }
}
