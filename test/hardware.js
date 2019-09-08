import test from 'ava';
// import { nearlyEqual } from './helpers/nearlyEqual';
import * as Hardware from '../src/hardware';
import { ImperialBolts } from '../src/imperial';

// import { util, init as utilInit } from '@jwc/jscad-utils';
// console.warn('utilInit', utilInit.default);

test('import util', t => {
  // console.log(
  //     Object.keys(util)
  //         .map(k => `test.todo('${k}');`)
  //         .join('\n')
  // );

  t.snapshot(Object.keys(Hardware).sort());
});

// test('imperial bolt', t => {
//   // utilInit.default(CSG);
//   var bolt = Hardware.Bolt(util.inch(1), ImperialBolts['1/4 hex'], 'close');
// });
