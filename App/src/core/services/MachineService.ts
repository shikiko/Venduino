import { API_URL } from '@src/config';
import client, { AuthorizationHeader } from './client';

const SERVICE = 'MachineService';

export const fetchAll = async () => {
  const path = '/machine';
  console.log(SERVICE, API_URL + path);
  try {
    const response = await client.get(path, {
      headers: await AuthorizationHeader(),
    });
    console.log(SERVICE, response.data);
    return response.data;
  } catch (err) {
    console.log(SERVICE, 'Failed with', err.message);
    throw err;
  }
};

export const fetchInventory = async (data: any) => {
  if (!data.machineId) throw Error('Invalid body');
  const path = `/machine/${data.machineId}/inventory`;
  console.log(SERVICE, API_URL + path);
  try {
    const response = await client.get(path, {
      headers: await AuthorizationHeader(),
    });
    return response.data;
  } catch (err) {
    console.log(SERVICE, 'Failed with', err.message);
    throw err;
  }
};

export const buy = async (data: any) => {
  if (!data.machine_id || !data.item_id || !data.quantity)
    throw Error('Invalid body');
  const path = `/machine/${data.machine_id}/buy`;
  console.log(SERVICE, API_URL + path);
  try {
    const response = await client.post(path, data, {
      headers: await AuthorizationHeader(),
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    const message = err.response ? err.response.data.error : err.message;
    console.log(SERVICE, 'Failed with', message);
    throw Error(message);
  }
};
