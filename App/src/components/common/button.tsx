import React from 'react';
import {
  Button as LibButton,
  ButtonProps as LibButtonProps,
  withStyles,
  ThemedComponentProps,
  Text,
} from 'react-native-ui-kitten';

import { textStyle as CoreTextStyle } from '@src/core/themes/styles';
import { Touchable } from '@src/components/common';

export type ButtonProps = LibButtonProps & ThemedComponentProps & {};

const ButtonComponent = ({
  themedStyle,
  style,
  textStyle,
  appearance = 'filled',
  children,
  ...props
}: ButtonProps) => {
  if (appearance === 'link') {
    return (
      <Touchable {...props}>
        <Text style={themedStyle.text}>{children}</Text>
      </Touchable>
    );
  }
  return (
    <LibButton
      size="large"
      style={[themedStyle.button, style]}
      textStyle={[themedStyle.text, textStyle]}
      appearance={appearance}
      {...props}>
      {children}
    </LibButton>
  );
};

export const Button = withStyles(ButtonComponent, () => ({
  text: {
    ...CoreTextStyle.action,
  },
}));
