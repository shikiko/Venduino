import React from "react";
import { Dimensions } from "react-native";
import useSWR, { trigger } from "swr";
import {
  Layout,
  withStyles,
  ThemedComponentProps
} from "react-native-ui-kitten";

import { NewTransactionsList as TransactionsListBase } from "@src/components/app";
import { UserService } from "@src/core/services";

export type TransactionsListProps = ThemedComponentProps & {
  navigation: any;
};

export const fetchTransactions = async () => {
  const res = await UserService.fetchPurchases();
  return res.purchases.map((purchase: any) => ({
    ...purchase,
    title: `${purchase.quantity}x ${purchase.item_name}`,
    description: purchase.name
  }));
};

const TransactionsList = ({
  themedStyle,
  navigation,
  ...props
}: TransactionsListProps) => {
  const { data, isValidating } = useSWR(
    "/api/user/purchases/all",
    fetchTransactions,
    {
      refreshInterval: 2000
    }
  );

  const purchases = data ? data : [];

  const onItemPress = (item: any) => {
    navigation.navigate("TransactionsDetail", { transaction: item });
  };

  if (purchases.length === 0) return <></>;
  return (
    <>
      <Layout style={themedStyle.listContainer}>
        <TransactionsListBase
          {...props}
          data={purchases}
          loading={isValidating}
          onItemPress={onItemPress}
          onRefresh={() => {
            console.log("yes refresh");
            trigger("/api/user/purchases/all");
          }}
        />
      </Layout>
    </>
  );
};

export default withStyles(TransactionsList, theme => ({
  listContainer: {
    // flex: 1,
    height: Dimensions.get("window").height
  }
}));
