'use strict';

function _playSequence(blinker, sequence, repetitions) {
  // use 0 to indicate looping forever, ironically
  if(repetitions === Infinity) {
    repetitions = 0;
  }

  console.info('Playing...');
  sequence.forEach(function(instruction, index) {
    console.info(instruction);
    blinker.writePatternLine(
      instruction.fade,
      instruction.red,
      instruction.green,
      instruction.blue,
      index
    );
  });

  blinker.playLoop(0, sequence.length - 1, repetitions);
}

function _fadeToColor(blinker, instruction) {
  blinker.fadeToRGB(
    instruction.fade,
    instruction.red,
    instruction.green,
    instruction.blue
  );
}

function playSequenceOnBlinker(blinker, sequence, repetitions) {
  repetitions = repetitions || 1;

  // We have to special-case a sequence with one instruction,
  // because Blink1#playLoop is funky with zeros.
  if(sequence.length > 1) {
    _playSequence(blinker, sequence, repetitions);
  } else if(sequence.length === 1) {
    _fadeToColor(blinker, sequence[0]);
  } else { // 0 instructions
    blinker.off();
  }
}

module.exports = {
  playSequenceOnBlinker
};
