import React, { useState } from "react";
import { Dimensions, ViewProps, RefreshControl } from "react-native";
import {
  Layout as View,
  Text,
  withStyles,
  ThemedComponentProps
} from "react-native-ui-kitten";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider
} from "recyclerlistview";

import { Touchable } from "@src/components/common";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ROW_HEIGHT = 80;

// Create the data provider and provide method which takes in two rows of data and return if those two are different or not.
// THIS IS VERY IMPORTANT, FORGET PERFORMANCE IF THIS IS MESSED UP
const dataProvider = new DataProvider((r1, r2) => {
  return r1 !== r2;
});

interface ComponentProps {
  onItemPress: (item: any) => void;
  onRefresh: () => void;
  data: any[];
  loading?: boolean;
}

export type NewTransactionsListProps = ThemedComponentProps &
  ViewProps &
  ComponentProps;

const NewTransactionsListComponent = ({
  themedStyle,
  data,
  loading = false,
  onItemPress,
  onRefresh,
  ...props
}: NewTransactionsListProps) => {
  const { width } = Dimensions.get("window");
  const layoutProvider = new LayoutProvider(
    index => {
      return index;
    },
    (type, dimension) => {
      dimension.height = ROW_HEIGHT; // eslint-disable-line no-param-reassign
      dimension.width = width; // eslint-disable-line no-param-reassign
    }
  );

  const [listData] = useState(dataProvider.cloneWithRows(data));

  const rowRenderer = (type: any, rowData: any) => {
    const {
      quantity,
      item_name: itemName,
      name,
      timestamp,
      price,
      type: saleType
    } = rowData;
    const time = dayjs(timestamp).fromNow();
    if (saleType === "topup")
      return (
        <View style={themedStyle.rowContainer} {...props}>
          <View style={themedStyle.rowDetailContainer}>
            <View style={themedStyle.titleContainer}>
              <Text style={themedStyle.title}>{name}</Text>
            </View>
            <Text style={themedStyle.subtitle}>{`${time}`}</Text>
          </View>
          <View style={themedStyle.accessoryContainer}>
            <Text
              style={[themedStyle.price, { color: "green" }]}
            >{`+ $${price}`}</Text>
          </View>
        </View>
      );
    return (
      <Touchable
        feedback="raised"
        onPress={() => {
          if (onItemPress) onItemPress(rowData);
        }}
      >
        <View style={themedStyle.rowContainer} {...props}>
          <View style={themedStyle.rowDetailContainer}>
            <View style={themedStyle.titleContainer}>
              <Text style={themedStyle.quantity}>{`${quantity}x`}</Text>
              <Text style={themedStyle.title}>{itemName}</Text>
            </View>
            <Text style={themedStyle.subtitle}>{`${time} at ${name}`}</Text>
          </View>
          <View style={themedStyle.accessoryContainer}>
            <Text style={themedStyle.price}>{`$${price}`}</Text>
          </View>
        </View>
      </Touchable>
    );
  };
  return (
    <RecyclerListView
      style={themedStyle.container}
      layoutProvider={layoutProvider}
      dataProvider={listData}
      rowRenderer={rowRenderer}
      // scrollViewProps={{
      //   refreshControl: (
      //     <RefreshControl
      //       refreshing={loading}
      //       onRefresh={() => {
      //         if (onRefresh) onRefresh();
      //       }}
      //     />
      //   ),
      // }}
    />
  );
};

export default withStyles(NewTransactionsListComponent, theme => ({
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row"
  },
  rowDetailContainer: {},
  accessoryContainer: {
    padding: 8
  },
  quantity: {
    color: theme["text-disabled-color"],
    marginRight: 4
  },
  subtitle: {
    color: theme["text-hint-color"]
  },
  title: {
    color: theme["text-basic-color"]
  },
  price: {
    color: theme["color-primary-default"]
  }
}));
