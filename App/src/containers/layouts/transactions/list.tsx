import React from 'react';
import { Layout, Text, withStyles } from 'react-native-ui-kitten';

import { TransactionsList } from '@src/containers/components';

const TransactionsComponent = ({ themedStyle, navigation }: any) => {
  return (
    <>
      <Layout style={themedStyle.container}>
        <Text style={themedStyle.helloLabel} category="h1">
          Transactions
        </Text>

        <Layout>
          <TransactionsList navigation={navigation} />
        </Layout>
      </Layout>
    </>
  );
};

export const Transactions = withStyles(TransactionsComponent, () => ({
  container: {
    flex: 1,
    padding: 16,
  },
  illustrationContainer: {
    marginBottom: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helloLabel: {
    marginBottom: 32,
  },
  buttonSpace: {
    marginTop: 16,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
  },
}));
