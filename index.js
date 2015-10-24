'use strict';

// Libraries
const denodeify = require('denodeify'); // Hooray for Promises!
const Blink1 = require('node-blink1');

const SlowZone = require('slow-zone');

// Configuration stuff
const CONFIG = require('./config.js');

let blinker;
try {
  blinker = new Blink1(CONFIG.BLINK1_SERIAL_NUMBER || undefined); // undefined = the first one the library finds
} catch(e) {
  // new Blink1() throws an Error if it doesn't find a blinker.
  console.error('Could not find a blink(1)' + (CONFIG.BLINK1_SERIAL_NUMBER ? ' with serial number ' + CONFIG.BLINK1_SERIAL_NUMBER : '') + '.');
  process.exit(1);
}

let sz = new SlowZone({
  apiKey: CONFIG.TRAIN_TRACKER_API_KEY
});
const arrivalsByStop = denodeify(sz.arrivals.byStop);

const calculateColorIntensity = function(minutesAway, maximumMinutes) {
  // first, calculate the ratio of how far the train is away to our threshold, reversed because we want more intensity the closer it is.
  let intensity = (maximumMinutes - minutesAway) / maximumMinutes;
  // now scale that percentage up to the 0-255 scale
  intensity = (intensity * 255);
  return intensity;
};

const checkArrivalsAndChangeBlinker = function() {
  return arrivalsByStop(
    CONFIG.STOP.ID,
    {} // no options needed
  )
  .then(function(arrivals) {
    console.log('Got some data:');
    console.log(arrivals);
    let firstArrival = arrivals[0];

    if(firstArrival && firstArrival.prediction.arrivalMinutes <= CONFIG.MAXIMUM_TIME_AWAY) {
      const minutesAway = firstArrival.prediction.arrivalMinutes;

      // for now, this is how we'll do this
      const redGreenOrBlue = Math.random();
      const colors = {
        red: redGreenOrBlue <= 0.33 ? calculateColorIntensity(minutesAway, CONFIG.MAXIMUM_TIME_AWAY) : 0,
        green: redGreenOrBlue > 0.33 && redGreenOrBlue < 0.67 ? calculateColorIntensity(minutesAway, CONFIG.MAXIMUM_TIME_AWAY) : 0,
        blue: redGreenOrBlue > 0.67 ? calculateColorIntensity(minutesAway, CONFIG.MAXIMUM_TIME_AWAY) : 0
      };

      console.log('fading...', colors);
      blinker.fadeToRGB(1000, colors.red, colors.green, colors.blue);
    } else {
      console.log('no arrivals returned');
      blinker.fadeToRGB(1000, 0, 0, 0);
    }

    return arrivals;
  })
  .catch(function(err) {
    console.error('The Train Tracker API returned an error:');
    console.error(err);
    throw err;
  });
};

const checkAndRepeat = function() {
  console.log('check and repeat');
  return checkArrivalsAndChangeBlinker()
    .then(function() {
      // console.log('*** EXITING SAFELY');
      // blinker.off();
      // process.exit(0);
      console.log('setting timeout');
      setTimeout(checkAndRepeat, CONFIG.CHECK_INTERVAL * 1000);
    })
    .catch(function() {
      process.exit(2);
    });
};

checkAndRepeat();
