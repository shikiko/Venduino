import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';

import {
  Layout,
  Text,
  Button,
  withStyles,
  ThemedComponentProps,
} from 'react-native-ui-kitten';
import { useSafeArea } from 'react-native-safe-area-context';

import { UserService } from '@src/core/services';
import { TopupForm } from '@src/components/forms';
import { Separator } from '@src/components/common';

export type Props = ThemedComponentProps & any;

export const fetchProfile = async () => {
  const res = await UserService.fetchUser();
  return res.user;
};

const DEFAULT_FORM = {
  amount: {
    value: 0,
  },
};

const TopupComponent = ({ themedStyle, navigation }: Props) => {
  const [form, setForm] = useState<any>(DEFAULT_FORM);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: user } = useSWR('/api/user/profile', fetchProfile, {
    refreshInterval: 3000,
  });

  const insets = useSafeArea();

  const onChange = (key: string, value: any) => {
    if (!loading) {
      const newForm = {
        ...form,
        [key]: {
          value,
          status: '',
          caption: null,
        },
      };
      setForm(newForm);
    }
  };

  const onTopup = async () => {
    try {
      if (form.amount.value <= 0) {
        throw Error('Invalid amount');
      }
      setLoading(true);
      const res = await UserService.topup({ value: form.amount.value });
      mutate('/api/user/profile', {
        ...user,
        ...res.user,
      });

      navigation.goBack();
    } catch (error) {
      const newForm = form;
      Object.keys(newForm).map(key => {
        newForm[key] = {
          ...form[key],
          status: 'danger',
          caption: 'Invalid amount',
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
      <Layout style={[themedStyle.container, { paddingBottom: insets.bottom }]}>
        <Layout style={themedStyle.topContainer}>
          <Text style={themedStyle.text} category="h1">
            Top up
          </Text>
          <Text style={themedStyle.price} category="h1">
            {user &&
              `$${Number(user.balance)
                .toFixed(2)
                .toString()}`}
          </Text>
          <Text style={themedStyle.subtitle}>Current balance</Text>
        </Layout>

        <Layout style={themedStyle.separatorContainer}>
          <Separator style={themedStyle.separator} />
        </Layout>

        <Text style={themedStyle.label}>Amount</Text>
        <TopupForm value={form} onChange={onChange} loading={loading} />

        <Button size="large" onPress={onTopup} disabled={loading}>
          Top up
        </Button>
      </Layout>
    </>
  );
};

export default withStyles(TopupComponent, theme => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  topContainer: {
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    // color: theme['text-hint-color']
  },
  subtitle: {
    fontWeight: 'bold',
    color: theme['text-hint-color'],
  },
  price: {
    fontWeight: 'normal',
    color: theme['color-primary-default'],
  },
  separatorContainer: {
    alignItems: 'center',
  },
  separator: {
    width: 128,
    marginTop: 48,
    marginBottom: 32,
  },
}));
