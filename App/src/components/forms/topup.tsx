import React, { useState } from "react";
import { Layout, withStyles, Input } from "react-native-ui-kitten";

const TopupFormComponent = ({
  value,
  loading = false,
  onChange,
  themedStyle
}: any) => {
  if (!value) return <Layout style={themedStyle.container} />;
  return (
    <Layout style={themedStyle.container}>
      <Input
        style={themedStyle.input}
        placeholder="0.00"
        value={value.amount.value.toString()}
        status={value.amount.status}
        caption={value.amount.caption}
        onChangeText={v => onChange("amount", v)}
        disabled={loading}
        keyboardType="numeric"
      />
    </Layout>
  );
};

export const TopupForm = withStyles(TopupFormComponent, () => ({
  container: {},
  input: {
    marginBottom: 12
  }
}));
