import express from 'express';
import { getAuthToken } from './readings/auth';
import { getReadings } from './readings/readings';
import { summarizeReading } from './readings/readingUtils';
import { DEFAULT_READING_METADATA } from './readings/constants';
const app = express();
const port = 4242;

app.get('/', (_req, res) => {
  res.send('hello world');
});

app.get('/readings', async (_req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const authToken = await getAuthToken();
    const readings = await getReadings(authToken);
    res.send(
      JSON.stringify({
        readings: readings.map((reading) =>
          summarizeReading(DEFAULT_READING_METADATA, reading),
        ),
      }),
    );
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

app.listen(port, () => {
  console.log(`JazComAPI listening on port ${port}`);
});
