import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { Layout, Text, withStyles } from "react-native-ui-kitten";

import { Button, Separator } from "@src/components/common";
import { STORAGE_USER_TOKEN_KEY } from "@src/config";

const AccountComponent = ({ themedStyle, navigation }: any) => {
  return (
    <>
      <Layout style={themedStyle.container}>
        <Text style={themedStyle.helloLabel} category="h1">
          Account
        </Text>
        <Button
          status="basic"
          style={themedStyle.buttonSpace}
          onPress={async () => {}}
        >
          Edit profile
        </Button>
        <Button
          status="basic"
          style={themedStyle.buttonSpace}
          onPress={async () => {}}
        >
          Settings
        </Button>
        <Separator style={themedStyle.separator} />
        <Button
          status="danger"
          appearance="outline"
          onPress={async () => {
            AsyncStorage.removeItem(STORAGE_USER_TOKEN_KEY); // Run async
            console.log("Removed usertoken");
            navigation.navigate({ name: "Auth", key: "Landing" });
          }}
        >
          Logout
        </Button>
      </Layout>
    </>
  );
};

export const Account = withStyles(AccountComponent, () => ({
  container: {
    flex: 1,
    padding: 16
  },
  illustrationContainer: {
    marginBottom: 48,
    justifyContent: "center",
    alignItems: "center"
  },
  helloLabel: {
    marginBottom: 32
  },
  buttonSpace: {
    marginTop: 16
  },
  buttonOutline: {
    backgroundColor: "transparent"
  },
  separator: {
    marginVertical: 24
  }
}));
