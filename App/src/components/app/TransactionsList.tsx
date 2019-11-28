import React from "react";
import {
  Layout,
  Text,
  withStyles,
  ThemedComponentProps,
  List,
  ListItem
} from "react-native-ui-kitten";

export type TransactionItemProps = {
  title: string;
  description: string;
  price: number;
};

export type TransactionsListProps = ThemedComponentProps & {
  data: TransactionItemProps[];
};

const TransactionsList = ({ data, themedStyle }: TransactionsListProps) => {
  const renderItem = ({ item }: any) => {
    if (item.type === "topup")
      return (
        <ListItem
          title="Topup"
          description=""
          accessory={() => (
            <Text style={{ color: "green" }}>+${item.price}</Text>
          )}
        />
      );
    return (
      <ListItem
        title={`${item.title}`}
        description={`${item.description}`}
        accessory={() => <Text>${item.price}</Text>}
      />
    );
  };
  return (
    <List
      contentContainerStyle={themedStyle.container}
      data={data}
      renderItem={renderItem}
    />
  );
};

export default withStyles(TransactionsList, theme => ({
  container: {
    justifyContent: "space-between",
    marginBottom: 16
  }
}));
