import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { StyleSheet } from "react-native";
import { Layout, Spinner } from "react-native-ui-kitten";
import { NavigationProp } from "@react-navigation/core";

import { STORAGE_USER_TOKEN_KEY } from "@src/config";

type Props = {
  navigation: NavigationProp<any>;
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});

export const AuthLoadingScreen = ({ navigation }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  useEffect(() => {
    console.log("Authing");
    const checkToken = async () => {
      const userToken = await AsyncStorage.getItem(STORAGE_USER_TOKEN_KEY);
      console.log("Got token", userToken);
      navigation.reset({
        index: 0,
        routes: [{ name: userToken ? "App" : "Auth" }]
      });
    };
    checkToken();
  }, [navigation]);

  // Only show loader after 800ms
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 800);

    // Clear when component unmount
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Layout style={styles.container}>{show && <Spinner size="giant" />}</Layout>
  );
};
