import { DX_2_ENDPOINT_PROPS } from './endpoints';
import { isDefined } from '../utils';

const accountName: string = process.env.accountName || '';
const password: string = process.env.password || '';
const DELTA_TIME_IN_MINUTES = 45;

let lastAuthToken: string;
let lastAuthenticationTimeInMinutes: number;

export async function getAuthToken() {
  const currentTimeInMinutes = Date.now() / 60_000;
  if (
    !isDefined(lastAuthToken) ||
    !isDefined(lastAuthenticationTimeInMinutes) ||
    currentTimeInMinutes - lastAuthenticationTimeInMinutes >
      DELTA_TIME_IN_MINUTES
  ) {
    console.log(`Requesting new token for ${accountName}`);
    const authEndpointProps = DX_2_ENDPOINT_PROPS.auth;
    const { method, headers, bodyBase, bodySchema } = authEndpointProps;
    const body = bodySchema.parse({
      ...bodyBase,
      accountName,
      password,
    });

    const authResponse = await fetch(authEndpointProps.url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    lastAuthToken = await authResponse.json();
    lastAuthenticationTimeInMinutes = currentTimeInMinutes;
    if (lastAuthToken.startsWith('0000000')) {
      throw new Error(`Failed to get valid token for user ${accountName}`);
    }
  }
  if (!isDefined(lastAuthToken)) {
    throw new Error(`Unable to authenticate for user ${accountName}`);
  }
  return lastAuthToken;
}
