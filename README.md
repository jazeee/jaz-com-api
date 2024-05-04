# JazCom API

JazCom API
This API expects an `accountName` and `password`. You enter this when you start the API.

## Example

```
$ npm run dev

> jaz-com-api@1.0.0 dev
> nodemon --no-stdin dist/main.js

[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node dist/main.js`
? Account name ...
? Password *
JazComAPI listening on port 4242
```

## Test using curl

```
> curl http://localhost:4242/readings
{"readings":[{"timeInMilliseconds":1714864388000,"timeInSeconds":1714864388,"timeSinceLastReadingInSeconds":274.5160000324249,"timeSinceLastReadingInMinutes":4.5752666672070825,"readingIsOld":false,"date":"2024-05-04T23:13:08.000Z","value":92,"trend":"Flat","color":"green","isHigh":false,"isLow":false,"isInRange":true}]}
```

## Setup

- `npm install`

## Run in development

- `npm run build:watch` in one shell
- `npm run dev` in a second shell

## Build

- `npm run build`

## Run

- `npm start`
