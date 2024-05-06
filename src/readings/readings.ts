import { DX_2_ENDPOINT_PROPS } from './endpoints';
import { isDefined } from '../utils';
import { isReadingPastStaleTime } from './readingUtils';

export enum Trend {
  DoubleDown = 'DoubleDown',
  SingleDown = 'SingleDown',
  FortyFiveDown = 'FortyFiveDown',
  Flat = 'Flat',
  FortyFiveUp = 'FortyFiveUp',
  SingleUp = 'SingleUp',
  DoubleUp = 'DoubleUp',
}

export interface ReadingDatum {
  DT: string; // "\/Date(1426780716000-0700)\/",
  ST: string; // "\/Date(1426784306000)\/",
  Trend: Trend;
  Value: number; // 99
  WT: string; //"\/Date(1426769941000)\/"
}

let lastReadings: ReadingDatum[];

export async function getReadings(authToken: string) {
  if (
    !isDefined(lastReadings?.[0]) ||
    isReadingPastStaleTime(lastReadings[0])
  ) {
    console.log(`Requesting new readings at ${new Date().toISOString()}`);
    const dataEndpointProps = DX_2_ENDPOINT_PROPS.data;
    const { method, headers, querySchema } = dataEndpointProps;
    const searchParams = new URLSearchParams(
      querySchema.parse({
        sessionId: authToken,
        minutes: '1440',
        maxCount: '100',
      }),
    );

    const readingsResponse = await fetch(
      `${dataEndpointProps.url}?${searchParams.toString()}`,
      {
        method,
        headers,
      },
    );
    if (readingsResponse.status !== 200) {
      throw new Error(
        `Failed to get successful API response: ${readingsResponse.status}`,
      );
    }
    lastReadings = await readingsResponse.json();
    if (lastReadings.length === 0) {
      throw new Error(`Failed to get readings`);
    }
  }
  if (!isDefined(lastReadings)) {
    throw new Error(`Unable to get readings`);
  }
  return lastReadings;
}
