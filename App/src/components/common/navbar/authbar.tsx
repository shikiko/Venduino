import React from 'react';

import { AppLogo } from '@src/assets/icons';
import { Navbar, NavbarProps } from './bar';

const Title = (): React.ReactElement => <AppLogo height={32} width={150} />;

export type NavbarAuthProps = NavbarProps & {
  title: any;
};

export const NavbarAuth = ({ title, showBack, ...props }: NavbarAuthProps) => {
  return <Navbar title={<Title />} showBack={showBack} {...props} />;
};
