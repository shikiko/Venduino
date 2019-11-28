import React, { useState } from "react";
import {
  Dimensions,
  ViewProps,
  View,
  RefreshControl,
  Image,
  FlatList
} from "react-native";
import {
  Layout,
  Text,
  withStyles,
  ThemedComponentProps
} from "react-native-ui-kitten";
import Modal from "react-native-modal";

import { Touchable, Button } from "@src/components/common";

interface ComponentProps {
  onOrder: (item: any) => void;
  onRefresh: () => void;
  data: any[];
  loading?: boolean;
}

export type MenuProps = ThemedComponentProps & LayoutProps & ComponentProps;

const COLUMNS = 2;

const MenuComponent = ({
  themedStyle,
  data,
  loading,
  onOrder,
  onRefresh,
  ...props
}: MenuProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setItem] = useState();
  const renderModalElement = () => {
    if (!selectedItem) return <></>;
    return (
      <Layout level="3" style={themedStyle.modalContainer}>
        <Text category="h2">{selectedItem.item_name}</Text>
        <View style={themedStyle.imageContainer}>
          <Image
            style={themedStyle.imageThumbnail}
            source={{ uri: selectedItem.image }}
          />
        </View>
        <Button
          status="primary"
          onPress={async () => {
            if (onOrder) await onOrder(selectedItem);
            setModalVisible(false);
          }}
        >
          {`Buy $${selectedItem.price}`}
        </Button>
      </Layout>
    );
  };
  const onItemPress = (item: any) => {
    setItem(item);
    setModalVisible(true);
  };
  if (!data || data.length === 0)
    return (
      <Layout style={themedStyle.emptyContainer}>
        <Text category="h3" appearance="hint">
          No items available
        </Text>
      </Layout>
    );
  return (
    <Layout style={themedStyle.container}>
      <Modal
        isVisible={modalVisible}
        backdropColor="#111"
        onBackdropPress={() => setModalVisible(false)}
      >
        {renderModalElement()}
      </Modal>
      <FlatList
        contentContainerStyle={themedStyle.listContainer}
        data={data}
        // onRefresh={onRefresh}
        // refreshing={loading}
        renderItem={({ item }: any) => {
          const available = item.quantity > 0;
          const content = (
            <Layout style={themedStyle.itemContainer}>
              <Image
                style={themedStyle.imageThumbnail}
                source={{ uri: item.image }}
              />
              <Text category="h6">{item.item_name}</Text>
              <Text style={themedStyle.price}>{`$${item.price}`}</Text>
            </Layout>
          );
          if (!available)
            return <Layout style={themedStyle.disabledItem}>{content}</Layout>;
          return (
            <Touchable onPress={() => onItemPress(item)} feedback="highlight">
              {content}
            </Touchable>
          );
        }}
        numColumns={COLUMNS}
        keyExtractor={(item: any, index: number) =>
          item.item_name + item.item_id
        }
      />
    </Layout>
  );
};

export default withStyles(MenuComponent, theme => ({
  container: {},
  emptyContainer: {
    padding: 12,
    alignItems: "center"
  },
  modalContainer: {
    borderRadius: 12,
    padding: 12
  },
  imageContainer: {
    alignItems: "center"
  },
  listContainer: {
    // flex: 1,
    paddingVertical: 12,
    alignItems: "center"
  },
  itemContainer: {
    flex: 1,
    flexDirection: "column",
    marginVertical: 8,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 4,
    backgroundColor: theme["background-basic-color-2"]
  },
  disabledItem: {
    opacity: 0.5
  },
  imageThumbnail: {
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    height: 150,
    width: 150,
    marginBottom: 8
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
    color: theme["color-primary-default"],
    fontSize: 18
  }
}));
