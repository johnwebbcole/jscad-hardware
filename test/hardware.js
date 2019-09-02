import test from 'ava';
// import { nearlyEqual } from './helpers/nearlyEqual';
import * as hardware from '../src/hardware';

test('import util', t => {
  // console.log(
  //     Object.keys(util)
  //         .map(k => `test.todo('${k}');`)
  //         .join('\n')
  // );

  t.snapshot(Object.keys(hardware).sort());
});
