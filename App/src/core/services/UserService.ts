import AsyncStorage from '@react-native-community/async-storage';

import { STORAGE_USER_TOKEN_KEY, API_URL } from '@src/config';
import client, { AuthorizationHeader } from './client';

const SERVICE = 'UserService';

export const fetchUser = async () => {
  const path = '/user/profile';
  console.log(SERVICE, API_URL + path);
  try {
    const response = await client.get(path, {
      headers: await AuthorizationHeader(),
    });
    return response.data;
  } catch (err) {
    const message = err.response ? err.response.data.error : err.message;
    console.log(SERVICE, 'Failed with', message);
    throw Error(message);
  }
};

export const login = async (data: any) => {
  const path = '/user/login';
  console.log(SERVICE, API_URL + path, data);
  const { username, password } = data;
  if (!username || !password) throw Error('Invalid body');
  try {
    const response = await client.post(path, data);
    await AsyncStorage.setItem(STORAGE_USER_TOKEN_KEY, response.data.token);
    return response.data;
  } catch (err) {
    const message = err.response ? err.response.data.error : err.message;
    console.log(SERVICE, 'Failed with', message);
    throw Error(message);
  }
};

export const topup = async (data: any) => {
  const path = '/user/topup';
  console.log(SERVICE, API_URL + path, data);
  if (!data.value) throw Error('Invalid body');
  try {
    const response = await client.post(path, data, {
      headers: await AuthorizationHeader(),
    });
    return response.data;
  } catch (err) {
    const message = err.response ? err.response.data.error : err.message;
    console.log(SERVICE, 'Failed with', message);
    throw Error(message);
  }
};

export const fetchPurchases = async (data: any = {}) => {
  // { start, limit }
  const path = `/user/purchases?start=${data.start || 0}&limit=${data.limit ||
    1000}`;
  console.log(SERVICE, API_URL + path);
  try {
    const response = await client.get(path, {
      headers: await AuthorizationHeader(),
    });
    return response.data;
  } catch (err) {
    const message = err.response ? err.response.data.error : err.message;
    console.log(SERVICE, 'Failed with', message);
    throw Error(message);
  }
};

export const logout = async () => {
  console.log(SERVICE, 'Logout');
  // if (!username || !password) throw Error('Invalid body');
  await AsyncStorage.removeItem(STORAGE_USER_TOKEN_KEY); // Run async
  return true;
};
