import React from 'react';
import useSWR from 'swr';
import {
  Layout,
  Text,
  withStyles,
  ThemedComponentProps,
} from 'react-native-ui-kitten';

import { TransactionsList as TransactionsListBase } from '@src/components/app';
import { UserService } from '@src/core/services';

export type RecentTransactionsProps = ThemedComponentProps;

export const fetchTransactions = async () => {
  const res = await UserService.fetchPurchases({ limit: 5 });
  return res.purchases.map((purchase: any) => ({
    ...purchase,
    title: `${purchase.quantity}x ${purchase.item_name}`,
    description: purchase.name,
  }));
};

const RecentTransactions = ({
  themedStyle,
  ...props
}: RecentTransactionsProps) => {
  const { data: purchases } = useSWR('/api/user/purchases', fetchTransactions, {
    refreshInterval: 3000,
  });

  return (
    <>
      <Text category="h6" style={themedStyle.label}>
        Recent transactions
      </Text>
      <Layout style={themedStyle.listContainer}>
        <TransactionsListBase {...props} data={purchases} />
      </Layout>
    </>
  );
};

export default withStyles(RecentTransactions, theme => ({
  listContainer: {
    flex: 1,
    // height: 58 * 3,
  },
  label: {
    marginVertical: 16,
  },
}));
