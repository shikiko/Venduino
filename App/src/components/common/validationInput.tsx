import React from "react";
import { ThemedComponentProps, withStyles } from "@kitten/theme";
import { Input, InputProps } from "@kitten/ui";

interface ComponentProps extends InputProps {
  validator: (value: string) => boolean;
  formatter?: (value: string, stateValue: string) => string;
  /**
   * Will emit changes depending on validation:
   * Will be called with input value if it is valid, otherwise will be called with undefined
   */
  onChangeText?: (value: string | undefined) => void;
}

interface State {
  value: string;
}

export type ValidationInputProps = ThemedComponentProps & ComponentProps;

/**
 * You probably don't need to pass `value` prop into this component
 */
class ValidationInputComponent extends React.Component<
  ValidationInputProps,
  State
> {
  public state: State = {
    value: this.props.value
  };

  public componentDidUpdate(prevProps: ValidationInputProps, prevState: State) {
    const { value: oldValue } = prevState;
    const { value: newValue } = this.state;

    const becomeValid: boolean =
      !this.isValid(oldValue) && this.isValid(newValue);
    const becomeInvalid: boolean =
      !this.isValid(newValue) && this.isValid(oldValue);

    const { onChangeText } = this.props;
    if (becomeValid && onChangeText) {
      onChangeText(newValue);
    } else if (becomeInvalid && onChangeText) {
      onChangeText(undefined);
    }
  }

  private onChangeText = (text: string) => {
    const { formatter } = this.props;
    const { value: stateValue } = this.state;

    const value: string = formatter ? formatter(text, stateValue) : text;

    this.setState({ value }, this.onValueChange);
  };

  private onValueChange = () => {
    const { value } = this.state;
    const { onChangeText } = this.props;

    if (this.isValid(value) && onChangeText) {
      onChangeText(value);
    }
  };

  private isValid = (value: string): boolean => {
    const { validator } = this.props;

    return validator(value);
  };

  private getStatus = (): string | undefined => {
    const { value } = this.state;

    if (value && value.length) {
      return this.isValid(value) ? "success" : "danger";
    }

    return undefined;
  };

  public render(): React.ReactNode {
    const { style, themedStyle, ...restProps } = this.props;
    const { value } = this.state;

    return (
      <Input
        autoCapitalize="none"
        status={this.getStatus()}
        {...restProps}
        value={value}
        style={[themedStyle.container, style]}
        onChangeText={this.onChangeText}
      />
    );
  }
}

export const ValidationInput = withStyles(ValidationInputComponent, () => ({
  container: {}
}));
