import { DX_2_ENDPOINT_PROPS } from './endpoints';
import { isDefined } from '../utils';
import { Credentials } from '../credentials/type';

const DELTA_TIME_IN_MINUTES = 45;

let lastAuthToken: string;
let lastAuthenticationTimeInMinutes: number;

export async function getAuthToken(credentials: Credentials) {
  const { accountName } = credentials;
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
      ...credentials,
    });

    const authResponse = await fetch(authEndpointProps.url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    if (authResponse.status !== 200) {
      throw new Error(
        `Failed to get successful API response: ${authResponse.status}`,
      );
    }
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
