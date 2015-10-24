'use strict';
const COLORS = require('./colors.js');

/**
 * Calculate the color intensity as a percentage based on how soon the train arrives.
 * 100% should be when the train is 1 minute or less away.
 * 0% should be when the train is more than 15 minutes away.
 */
function _calculateColorIntensity(arrivalMinutes, maximumMinutes) {
  maximumMinutes = maximumMinutes || 15;

  if(arrivalMinutes <= 1) {
    return 1;
  } else if(arrivalMinutes > maximumMinutes) {
    return 0;
  }

  return (maximumMinutes - arrivalMinutes) / maximumMinutes;
}

/**
 * Return the color sequence to display given an arrival/prediction.
 */
function fadeToArrival(arrival) {
  // TODO: Add an `offset` param that lets you indicate how much time it takes you to walk to the station.
  var lineColor = COLORS.LINE_COLORS[arrival.route.id],
      intensity = _calculateColorIntensity(arrival.prediction.arrivalMinutes);

  return [{
    fade: 1000,
    red: lineColor.red * intensity,
    green: lineColor.green * intensity,
    blue: lineColor.blue * intensity
  }];
}

/**
 * Return the color sequence to indicate that the program is working on something.
 */
function indicateWorking() {
  return COLORS.WORKING_COLORS.map(function(colorDef) {
    return {
      fade: 250,
      red: colorDef.red,
      green: colorDef.green,
      blue: colorDef.blue
    };
  });
}

/**
 * Return the color sequence to indicate that an error happened.
 */
function indicateError() {
  const black = {
    fade: 250,
    red: 0,
    green: 0,
    blue: 0
  };
  const red = {
    fade: 750,
    red: COLORS.ERROR_COLOR.red,
    green: COLORS.ERROR_COLOR.green,
    blue: COLORS.ERROR_COLOR.blue
  };

  return [black, red, black, red, black, red, black];
}

module.exports = {
  fadeToArrival,
  indicateWorking,
  indicateError
};
