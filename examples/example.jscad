
function main() {
  util.init(CSG);

  var ibolts = makeSet(makeBolt, ImperialBolts, -15, 25);
  var iwasher = makeSet(makeWasher, ImperialWashers, -50, 45);
  var mbolts =makeSet(makeBolt, MetricBolts, 15, 25); 
  

  return [union(ibolts).center('x'),
  union(iwasher).center('x'), union(mbolts).center('x')];
}

function makeWasher(washer) {
  return Hardware.Washer(washer).combine(
    'washer'
  );
}

function makeBolt(bolt) {
  return Hardware.Bolt(util.inch(1), bolt).combine(
    'head,thread'
  );
}

function makeSet(maker, set, offset, width) {
  return Object.keys(set).map(function(key, idx) {
    var bolt = maker(set[key])

    var label = util
      .label(key)
      .fit([width - 5, 10, 10], true)
      .rotateX(90)
      .rotateZ(180)
      .snap(bolt, 'z', 'outside-')
      .align(bolt, 'xy')
      .translate([0,0,5]);

    return union(bolt, label).translate([width * idx, offset, 0]);
  });
}

// include:js
// endinject
