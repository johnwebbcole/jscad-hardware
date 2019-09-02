function main() {
  util.init(CSG, { debug: '*' });
  var bolt = Hardware.Bolt(util.inch(1), ImperialBolts['1/4 hex'], 'close');
  var bolt2 = Hardware.Bolt(
    util.inch(1),
    MetricBolts['m8 socket'],
    'close'
  ).snap('head', bolt.parts.head, 'x', 'outside+', -10);

  return [bolt.combine('head,thread'), bolt2.combine('head,thread')];
}

// include:js
// endinject
