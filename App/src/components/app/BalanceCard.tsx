import React from 'react';
import {
  Layout,
  Text,
  withStyles,
  ThemedComponentProps,
} from 'react-native-ui-kitten';

import { Button } from '@src/components/common';

export type BalanceCardProps = ThemedComponentProps & {
  title?: string;
  balance?: string | number;
  action?: string;
  onAction?: () => void;
};

const BalanceCard = ({
  title = 'Balance',
  balance = '0',
  action = 'TOP UP',
  onAction = () => {},
  themedStyle,
}: BalanceCardProps) => {
  return (
    <Layout style={themedStyle.container}>
      <Layout>
        <Text category="h6">{title}</Text>
        <Text style={themedStyle.balanceText} category="p1">
          $
          {Number(balance)
            .toFixed(2)
            .toString()}
        </Text>
      </Layout>
      <Button
        style={themedStyle.buttonOutline}
        size="small"
        appearance="outline"
        onPress={onAction}>
        {action}
      </Button>
    </Layout>
  );
};

export default withStyles(BalanceCard, theme => ({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  balanceText: {
    lineHeight: 18,
    fontSize: 18,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
  },
}));
