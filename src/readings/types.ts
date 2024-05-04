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

export interface ReadingDatumDateProps {
  timeInMilliseconds?: number;
  timeInSeconds?: number;
  timeSinceLastReadingInSeconds?: number;
  timeSinceLastReadingInMinutes?: number;
  readingIsOld?: boolean;
  date?: Date;
}

export interface SummarizedReadingDatum extends ReadingDatumDateProps {
  value: number;
  trend: Trend;
  isHigh: boolean;
  isLow: boolean;
  isInRange: boolean;
  color: string;
  opacity?: number;
  isProjected?: boolean;
  projectedIndex?: number;
}

export interface ReadingMetadata {
  minScale: number;
  maxScale: number;
  lowWarning: number;
  highWarning: number;
  lowAxis: number;
  highAxis: number;
  higherAxis: number;
  units: string;
}
