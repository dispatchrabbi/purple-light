'use strict';

const CONFIG = require('./config.js');
const arrivals = require('./lib/arrivals-as-promised.js');
const blinkerPatterns = require('./lib/blinker-patterns.js');
const blinkerControl = require('./lib/blinker-control.js');

const Blink1 = require('node-blink1');
let blinker;
try {
  blinker = new Blink1(CONFIG.BLINK1_SERIAL_NUMBER || undefined); // undefined = the first one the library finds
} catch(e) {
  // new Blink1() throws an Error if it doesn't find a blinker.
  console.error('Could not find a blink(1)' + (CONFIG.BLINK1_SERIAL_NUMBER ? ' with serial number ' + CONFIG.BLINK1_SERIAL_NUMBER : '') + '.');
  process.exit(1);
}

const SlowZone = require('slow-zone');
let sz = new SlowZone({
  apiKey: CONFIG.TRAIN_TRACKER_API_KEY
});

function checkPredictionsAndReact(slowZoneInstance, blinker) {
  // Show that the program is retrieving new data
  blinkerControl.playSequenceOnBlinker(blinker, blinkerPatterns.indicateWorking(), Infinity);

  return arrivals
    .getArrivals(slowZoneInstance, CONFIG.STOP.ID)
    .then(function(arrivals) {
      if(arrivals.length > 0) {
        // use the first arrival to tell us what to show on the blinker.
        console.info(arrivals[0]);
        let arrivalBlinkerSequence = blinkerPatterns.fadeToArrival(arrivals[0]);
        console.info(arrivalBlinkerSequence);
        blinkerControl.playSequenceOnBlinker(blinker, arrivalBlinkerSequence);
      } else {
        // Just hang out for now... (maybe this should be a soft grey?)
        blinker.off();
      }

      return arrivals;
    })
    .catch(function(err) {
      blinkerControl.playSequenceOnBlinker(blinker, blinkerPatterns.indicateError());
      console.error('The Train Tracker API returned an error:');
      console.error(err);

      throw err;
    });
}

function checkAndScheduleNextCheck(slowZoneInstance, blinker) {
  checkPredictionsAndReact(slowZoneInstance, blinker)
    .then(function(/*arrivals*/) {
      console.info(`Setting a timeout for ${CONFIG.CHECK_INTERVAL} seconds from now.`);
      setTimeout(checkAndScheduleNextCheck.bind(null, slowZoneInstance, blinker), CONFIG.CHECK_INTERVAL * 1000);
    })
    .catch(function(err) {
      console.info('Caught an error. Exiting!');
      console.info(err.stack);
      process.exit(2);
    });
}

checkAndScheduleNextCheck(sz, blinker);
