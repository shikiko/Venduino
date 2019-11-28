import React from "react";
import useSWR from "swr";

import {
  BalanceCard as BalanceCardBase,
  BalanceCardProps as BalanceCardBaseProps
} from "@src/components/app";
import { UserService } from "@src/core/services";

export type BalanceCardProps = BalanceCardBaseProps & {
  onTopup: () => void;
};

export const fetchProfile = async () => {
  const res = await UserService.fetchUser();
  return res.user;
};

const BalanceCard = ({ onTopup, ...props }: BalanceCardProps) => {
  const { data: user } = useSWR("/api/user/profile", fetchProfile, {
    refreshInterval: 3000
  });
  return (
    <BalanceCardBase
      {...props}
      balance={user ? user.balance : 0}
      onAction={onTopup}
    />
  );
};

export default BalanceCard;
