
function main() {
  util.init(CSG);

  var ibolts = makeSet(makeBolt, ImperialBolts, -15, 25);
  var iwasher = makeSet(makeWasher, ImperialWashers, -50, 45);
  var iwood = makeSet(makeWoodScrew, ImperialWoodScrews, -75, 25);
  
  
  var mbolts =makeSet(makeBolt, MetricBolts, 15, 25); 
  

  return [union(iwood).center('x'),
  union(ibolts).center('x'),
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

function makeWoodScrew(args) {
  [h, l, d] = args;
  return Hardware.FlatHeadScrew(h, l, d, util.inch(1)).combine();
}

function makeSet(maker, set, offset, width) {
  return Object.keys(set).map(function(key, idx) {
    var bolt = maker(set[key])

    // var label = util
    //   .label(key)
    //   .fit([width - 5, 10, 10], true)
    //   .rotateX(90)
    //   .rotateZ(180)
    //   .snap(bolt, 'z', 'outside-')
    //   .align(bolt, 'xy')
    //   .translate([0,0,5]);

    return bolt.translate([width * idx, offset, 0]);
  });
}

// include:js
// endinject
