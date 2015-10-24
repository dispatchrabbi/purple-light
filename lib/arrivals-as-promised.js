'use strict';

function getArrivals(slowZoneInstance, stopID) {
  // The byStop function requires a SlowZone instance,
  // so we can't denodeify it in the general case. Hence
  // denodeifing it by hand here.
  return new Promise(function(resolve, reject) {
    slowZoneInstance.arrivals.byStop(
      stopID,
      {}, // additional request options
      function(err, arrivals) {
        if(err) {
          reject(err);
        } else {
          resolve(arrivals);
        }
      }
    );
  });
}

module.exports = {
  getArrivals
};
