import auth from '@react-native-firebase/auth';
import {API_BASE_URL} from '../Config/api';

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export const apiRequest = async (
  path,
  {method = 'GET', body, authenticated = true} = {},
) => {
  const headers = {Accept: 'application/json'};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (authenticated) {
    const user = auth().currentUser;
    if (!user) {
      throw new ApiError('Please log in again', 401, 'UNAUTHORIZED');
    }
    headers.Authorization = `Bearer ${await user.getIdToken()}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiError(
      'Cannot connect to the Athlefit backend. Make sure it is running.',
      0,
      'NETWORK_ERROR',
    );
  }

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (error) {
      payload = null;
    }
  }
  if (!response.ok) {
    throw new ApiError(
      payload?.message || 'Request failed',
      response.status,
      payload?.code || 'REQUEST_FAILED',
    );
  }
  return payload;
};
