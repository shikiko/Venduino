import React, { useState } from "react";
import { Layout, withStyles, Input } from "react-native-ui-kitten";

const SignupFormComponent = ({ themedStyle }: any) => {
  const [status, setStatus] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  return (
    <Layout style={themedStyle.container}>
      <Input
        style={themedStyle.input}
        status={status}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        style={themedStyle.input}
        status={status}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
    </Layout>
  );
};

export const SignupForm = withStyles(SignupFormComponent, () => ({
  container: {},
  input: {
    marginBottom: 12
  }
}));
