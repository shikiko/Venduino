import React, { useState } from 'react';
import { Layout, withStyles, Input } from 'react-native-ui-kitten';

const SigninFormComponent = ({
  value,
  loading = false,
  onChange,
  themedStyle,
}: any) => {
  return (
    <Layout style={themedStyle.container}>
      <Input
        style={themedStyle.input}
        placeholder="Username"
        value={value.username.value}
        status={value.username.status}
        caption={value.username.caption}
        onChangeText={v => onChange('username', v)}
        disabled={loading}
      />
      <Input
        style={themedStyle.input}
        placeholder="Password"
        value={value.password.value}
        status={value.username.status}
        caption={value.username.caption}
        onChangeText={v => onChange('password', v)}
        secureTextEntry
        disabled={loading}
      />
    </Layout>
  );
};

export const SigninForm = withStyles(SigninFormComponent, () => ({
  container: {},
  input: {
    marginBottom: 12,
  },
}));
