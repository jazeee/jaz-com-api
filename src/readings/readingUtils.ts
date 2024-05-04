import {
  ReadingDatum,
  ReadingDatumDateProps,
  ReadingMetadata,
  SummarizedReadingDatum,
} from './types';

export function extractDate(
  reading: ReadingDatum,
): ReadingDatumDateProps | undefined {
  const { ST: serverTimeString } = reading;
  const matches = /Date\(([0-9]*)\)/.exec(serverTimeString);
  if (matches) {
    const timeInMilliseconds = Number(matches[1]);
    const timeInSeconds = timeInMilliseconds / 1000;
    const timeSinceLastReadingInSeconds = Date.now() / 1000 - timeInSeconds;
    const timeSinceLastReadingInMinutes = timeSinceLastReadingInSeconds / 60;
    const readingIsOld = timeSinceLastReadingInSeconds > 10 * 60;
    return {
      timeInMilliseconds,
      timeInSeconds,
      timeSinceLastReadingInSeconds,
      timeSinceLastReadingInMinutes,
      readingIsOld,
      date: new Date(timeInMilliseconds),
    };
  }
}

export function summarizeReading(
  readingMetadata: ReadingMetadata,
  reading: ReadingDatum,
): SummarizedReadingDatum {
  const { higherAxis, lowAxis } = readingMetadata;
  const dateDetails = extractDate(reading) || {};
  const { Trend: trend, Value: value } = reading;
  const isHigh = value >= higherAxis;
  const isLow = value < lowAxis;
  const color = isHigh ? 'orange' : isLow ? 'red' : 'green';
  return {
    ...dateDetails,
    value,
    trend,
    color,
    isHigh,
    isLow,
    isInRange: !isHigh && !isLow,
  };
}

export function updateTestReadingDateTimes(readings: ReadingDatum[]) {
  const [latestReading] = readings;
  const latestReadingDate = extractDate(latestReading);
  readings.forEach((reading: ReadingDatum) => {
    const readingDate = extractDate(reading);
    const updatedTimeInMilliseconds =
      Date.now() +
      (readingDate?.timeInMilliseconds ?? 0) -
      (latestReadingDate?.timeInMilliseconds ?? 0);
    reading.ST = `/Date(${updatedTimeInMilliseconds})/`;
  });
}

const EXTRA_LATENCY_IN_SECONDS = 10 + 10 * Math.random();

export function getTimeToNextReadingInMilliseconds(reading: ReadingDatum) {
  const { timeSinceLastReadingInSeconds } = extractDate(reading) || {};
  let delayToNextRequestInSeconds = 5 * 60;
  delayToNextRequestInSeconds -= timeSinceLastReadingInSeconds ?? 0;
  delayToNextRequestInSeconds += EXTRA_LATENCY_IN_SECONDS;
  console.debug({ delayToNextRequestInSeconds });
  return delayToNextRequestInSeconds * 1000;
}

export function isReadingPastStaleTime(reading: ReadingDatum): boolean {
  const now = Date.now();
  const { timeInMilliseconds = now } = extractDate(reading) || {};
  const staleTimeInMilliseconds = timeInMilliseconds + 5 * 60 * 1000;
  console.debug({ staleTimeInMilliseconds });
  return staleTimeInMilliseconds < 0;
}
