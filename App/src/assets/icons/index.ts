import { Icon } from './icon';

export const EyeOffIconFill = style => {
  const source = {
    imageSource: require('./eye-off.png'),
  };

  return Icon(source, style);
};

export const PersonIconFill = style => {
  const source = {
    imageSource: require('./person.png'),
  };

  return Icon(source, style);
};

// export const AppIcon = style => {
//   const source = {
//     imageSource: require('./logo-icon.svg'),
//   };

//   return Icon(source, style);
// };

export { default as StartIllustration } from './illustrations/start.svg';
export { default as ArrowIcon } from './arrow.svg';
export { default as CaretIcon } from './caret.svg';
export { default as AppIcon } from './appicon.svg';
export { default as AppLogo } from './logo.svg';
export { default as GoogleLogo } from './google-g.svg';

export { default as AccountsIcon } from './accounts.svg';
export { default as TransactionsIcon } from './transactions.svg';
export { default as DashboardIcon } from './dashboard.svg';
export { default as BudgetsIcon } from './budgets.svg';
export { default as ReportsIcon } from './reports.svg';
export { default as CameraIcon } from './camera.svg';
export { default as QRCodeIcon } from './qrcode.svg';
export { default as FlashOnIcon } from './flash_on.svg';
export { default as FlashOffIcon } from './flash_off.svg';
