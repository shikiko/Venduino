import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { Layout, Text, withStyles, Icon } from "react-native-ui-kitten";

import { Button, Separator } from "@src/components/common";
import { SigninForm } from "@src/components/forms";
import { GoogleLogo } from "@src/assets/icons";
import { UserService } from "@src/core/services";

const StarIcon = (style: any) => <GoogleLogo />;
const DEFAULT_FORM = {
  username: {
    value: ""
  },
  password: {
    value: ""
  }
};
const SigninComponent = ({ themedStyle, navigation }: any) => {
  const [form, setForm] = useState<any>(DEFAULT_FORM);
  const [loading, setLoading] = useState<boolean>(false);

  const onChange = (key, value) => {
    if (!loading) {
      const newForm = {
        ...form,
        [key]: {
          value,
          status: "",
          caption: null
        }
      };
      setForm(newForm);
    }
  };

  const onLogin = async () => {
    try {
      setLoading(true);
      const res = await UserService.login({
        username: form.username.value,
        password: form.password.value
      });
      console.log("res");
      console.log(res);
      navigation.navigate("App");
    } catch (error) {
      const newForm = form;
      Object.keys(newForm).map(key => {
        newForm[key] = {
          ...form[key],
          status: "danger",
          caption: "Invalid username or password"
        };
        return null;
      });
      setForm(newForm);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Layout style={themedStyle.container}>
        <Text style={themedStyle.headerLabel} category="h1">
          Welcome back,{"\n"}
          Sign in
        </Text>

        <SigninForm value={form} onChange={onChange} loading={loading} />

        <Layout style={themedStyle.buttonContainer}>
          <Button size="giant" onPress={onLogin} disabled={loading}>
            Sign In
          </Button>

          <Layout style={themedStyle.resetContainer}>
            <Text style={themedStyle.resetLabel}>
              Forgot your password?&nbsp;
            </Text>
            <Button
              appearance="link"
              onPress={() => {
                navigation.navigate("Landing");
              }}
            >
              Reset Now
            </Button>
          </Layout>

          <Separator style={themedStyle.separator} />
        </Layout>
      </Layout>
    </>
  );
};

export const Signin = withStyles(SigninComponent, theme => ({
  container: {
    flex: 1,
    padding: 16
  },
  buttonContainer: {
    marginTop: 24
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
  },
  buttonGhost: {
    color: theme["text-hint-color"]
  },
  separator: {
    marginTop: 24,
    marginBottom: 12
  }
}));
