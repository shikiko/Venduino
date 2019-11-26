import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import { STORAGE_USER_TOKEN_KEY, API_URL } from '@src/config';
/**
 * This is an example of a service that connects to a 3rd party API.
 *
 * Feel free to remove this example from your application.
 */
console.log('API Client', API_URL);

export const AuthorizationHeader = async () => {
  const token = await AsyncStorage.getItem(STORAGE_USER_TOKEN_KEY);
  return { Authorization: `Bearer ${token}` };
};

export default axios.create({
  /**
   * Import the config from the App/Config/index.js file
   */
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});
