'use strict';

const LINE_COLORS = {
  'Red': {red: 198, green: 12, blue: 48},
  'Blue': {red: 0, green: 161, blue: 222},
  'Brn': {red: 98, green: 54, blue: 27},
  'G': {red: 0, green: 155, blue: 58},
  'Org': {red: 249, green: 70, blue: 28},
  'P': {red: 82, green: 35, blue: 152},
  'Pexp': {red: 82, green: 35, blue: 152}, // Purple Line Express!
  'Pink': {red: 226, green: 126, blue: 166},
  'Y': {red: 249, green: 227, blue: 0}
};

// TODO: Maybe use the line colors here?
const WORKING_COLORS = [
  {red:  0, green: 64, blue: 64},
  {red:  0, green:  0, blue: 64},
  {red: 64, green:  0, blue: 64},
  {red: 64, green:  0, blue:  0},
  {red: 64, green: 64, blue:  0},
  {red:  0, green: 64, blue:  0}
];

const ERROR_COLOR = {red: 128, green: 16, blue: 16};

module.exports = {
  LINE_COLORS,
  WORKING_COLORS,
  ERROR_COLOR
};
