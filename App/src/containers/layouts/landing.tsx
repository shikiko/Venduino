import React from "react";
import { Image } from "react-native";
import { Layout, Text, withStyles } from "react-native-ui-kitten";
import { Button } from "@src/components/common";
import { StartIllustration } from "@src/assets/icons";

const LandingComponent = ({ themedStyle, navigation }: any) => {
  return (
    <>
      <Layout style={themedStyle.container}>
        <Text style={themedStyle.helloLabel} category="h1">
          Ready to go cashless?
        </Text>

        <Layout style={themedStyle.illustrationContainer}>
          <StartIllustration style={themedStyle.test} height={330} />
        </Layout>

        <Layout style={themedStyle.buttonContainer}>
          <Button
            size="giant"
            onPress={() => {
              navigation.navigate("Signup");
            }}
          >
            Get Started
          </Button>
          <Button
            style={[themedStyle.buttonSpace, themedStyle.buttonOutline]}
            size="giant"
            appearance="outline"
            onPress={() => {
              navigation.navigate("Signin");
            }}
          >
            Already have an account
          </Button>
        </Layout>
      </Layout>
    </>
  );
};

export const Landing = withStyles(LandingComponent, () => ({
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
    marginTop: 12,
    lineHeight: 48,
    fontSize: 48,
    marginBottom: 32
  },
  buttonSpace: {
    marginTop: 16
  },
  buttonOutline: {
    backgroundColor: "transparent"
  }
}));
