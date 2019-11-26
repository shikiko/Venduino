import React from 'react';

import {
  View,
  Platform,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

export type TouchableProps = {
  feedback?: 'raised' | 'opacity' | 'highlight';
  onPress?: (event: GestureResponderEvent) => void | undefined;
  children: React.ReactChildren | React.ReactElement;
  style?: StyleProp<ViewStyle>;
};

const Touchable = ({
  feedback,
  onPress,
  children,
  ...props
}: TouchableProps) => {
  // Handle no feedback
  if (!feedback) {
    return (
      <TouchableWithoutFeedback onPress={onPress} {...props}>
        {children}
      </TouchableWithoutFeedback>
    );
  }
  if (feedback === 'highlight') {
    return (
      <TouchableHighlight underlayColor="white" onPress={onPress} {...props}>
        <View>{children}</View>
      </TouchableHighlight>
    );
  }

  // All Android Buttons should have the ripple effect
  if (Platform.OS === 'android') {
    // Raised Android buttons need a white ripple
    if (feedback === 'raised') {
      return (
        <TouchableNativeFeedback
          onPress={onPress}
          background={TouchableNativeFeedback.Ripple('#FFF')}
          {...props}>
          <View>{children}</View>
        </TouchableNativeFeedback>
      );
    }

    // Normal Android buttons get a gray ripple
    if (feedback === 'opacity') {
      return (
        <TouchableNativeFeedback
          onPress={onPress}
          background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.1)')}
          {...props}>
          <View>{children}</View>
        </TouchableNativeFeedback>
      );
    }
  }

  // iOS raised use TouchableHighlight
  // if (feedback === 'raised') {
  //   return (
  //     <TouchableHighlight underlayColor="#0052AC" onPress={onPress}>
  //       {children}
  //     </TouchableHighlight>
  //   );
  // }

  // Normal iOS buttons use TouchableOpacity
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      {children}
    </TouchableOpacity>
  );
};

export default Touchable;
