import { ReadingMetadata } from './types';

export const DEFAULT_READING_METADATA: ReadingMetadata = {
  units: 'mg/dL',
  lowWarning: 55,
  highWarning: 180,
  minScale: 30,
  lowAxis: 70,
  highAxis: 140,
  higherAxis: 160,
  maxScale: 250,
};
