'use strict';

const CONFIG = {
  /* The serial number of the blink(1) you want to address.
   * Leave falsy to just use the first blink(1) the app finds.
   */
  BLINK1_SERIAL_NUMBER: null,
  /* Your API key for the Train Tracker API.
   * Get one here: http://www.transitchicago.com/developers/ttkey.aspx
   */
  TRAIN_TRACKER_API_KEY: 'afafafafafafafafafafafafafafafaf',

  /* This object determines what stops you want to track.
   */
  STOP: {
    /* What stop you want to track departures from.
       Find stop IDs at https://data.cityofchicago.org/Transportation/CTA-System-Information-List-of-L-Stops/8pix-ypme
    */
    ID: 'STOP_ID'
  },

  /* How often we should check for new info, in seconds.
     Default is once a minute, or every 60 seconds.
  */
  CHECK_INTERVAL: 60
};

module.exports = CONFIG;
