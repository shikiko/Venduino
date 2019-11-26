import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Layout,
  Text,
  OverflowMenu,
  TopNavigation,
  TopNavigationProps,
  TopNavigationAction,
  TopNavigationActionProps,
  styled,
  StyleType,
} from 'react-native-ui-kitten';

import { StringValidator } from '@src/core/validators';
import BackButton from './backbutton';

export type NavbarControlProps = React.ReactElement | React.ReactElement[];
export type NavbarMenuDataProps = { [key: string]: string }[];

export type NavbarProps = TopNavigationProps & {
  title?: any;
  left?: NavbarControlProps;
  right?: NavbarControlProps;
  menuData?: NavbarMenuDataProps;
  showBack?: boolean;
  onBack?: () => void;
  onPress?: () => void;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {},
  subtitle: {},
  leftContainer: {
    width: 64,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  rightContainer: {
    width: 64,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  backButtonContainer: { flexDirection: 'row', alignItems: 'center' },
  backButtonText: { marginLeft: 8, fontSize: 16 },
});

const NavbarComponent = ({
  left,
  right,
  title,
  style,
  menuData,
  showBack,
  onBack,
  onPress,
  ...props
}: NavbarProps) => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const onMenu = () => {
    setMenuVisible(!menuVisible); // Toggle visibility
  };
  const onItem = () => {
    setMenuVisible(false); // Close menu
  };
  const renderText = (text: string) => <Text style={styles.title}>{text}</Text>;
  const renderElements = (source: React.ReactElement[]) => {
    return React.Children.map(source, (element, index) => {
      return React.cloneElement(element, {
        key: `navbar-element-${element.type}`,
      });
    });
  };
  const renderChild = (controls: any) => {
    if (StringValidator(controls)) return renderText(controls);
    return renderElements(controls);
  };
  return (
    <Layout style={[styles.container, style]} {...props}>
      <View style={styles.leftContainer}>
        {showBack && <BackButton onPress={onBack} />}
        {left}
      </View>
      <View style={styles.titleContainer}>{renderChild(title)}</View>
      <View style={styles.rightContainer}>{right}</View>
    </Layout>
  );
};

export const Navbar = NavbarComponent;
