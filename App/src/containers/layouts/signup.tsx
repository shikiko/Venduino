import React from "react";
import { Layout, Text, withStyles } from "react-native-ui-kitten";
import { Button } from "@src/components/common";
import { SignupForm } from "@src/components/forms";

// import StartIllustration from '@src/assets/icons/illustrations/start.svg';

const SignupComponent = ({ themedStyle, navigation }: any) => {
  return (
    <>
      <Layout style={themedStyle.container}>
        <Text style={themedStyle.headerLabel} category="h1">
          Hello,{"\n"}
          Create an account
        </Text>

        <SignupForm />

        <Layout style={themedStyle.buttonContainer}>
          <Button
            size="giant"
            onPress={() => {
              navigation.navigate("App");
            }}
          >
            Create Account
          </Button>

          <Layout style={themedStyle.resetContainer}>
            <Text style={themedStyle.resetLabel}>
              Already have an account?&nbsp;
            </Text>
            <Button
              appearance="link"
              onPress={() => {
                navigation.navigate("Signin");
              }}
            >
              Login Now
            </Button>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export const Signup = withStyles(SignupComponent, theme => ({
  container: {
    flex: 1,
    padding: 16
  },
  buttonContainer: {
    marginTop: 8
  },
  resetContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  resetLabel: {
    color: theme["text-hint-color"]
  },
  headerLabel: {
    marginBottom: 32
  },
  buttonSpace: {
    marginTop: 16
  },
  buttonOutline: {
    backgroundColor: "transparent"
  }
}));
