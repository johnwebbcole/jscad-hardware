function main() {
  util.init(CSG);

  var ibolts = makeSet(makeBolt, ImperialBolts);
  var iwood = makeSet(makeWoodScrew, ImperialWoodScrews);
  var mbolts = makeSet(makeBolt, MetricBolts);
  var iwasher = makeSet(makeWasher, ImperialWashers);

  return [
    union(ibolts)
      .center('x')
      .translate([0, -50, 0]),
    union(iwood)
      .center('x')
      .translate([0, -25, 0]),
    union(mbolts)
      .center('x')
      .translate([0, 0, 0]),
    union(iwasher)
      .center('x')
      .translate([0, 50, 0])
  ];
}

function makeWasher(washer) {
  return Hardware.Washer(washer).combine('washer');
}

function makeBolt(bolt) {
  return Hardware.Bolt(util.inch(1), bolt).combine('head,thread');
}

function makeWoodScrew(args) {
  [h, l, d] = args;
  return Hardware.FlatHeadScrew(h, l, d, util.inch(1)).combine();
}

function makeSet(maker, set, offset, width) {
  var g = util.group();
  Object.keys(set)
    .sort(function(a, b) {
      return (set[a].E || set[a].od) > (set[b].E || set[b].od) ? 1 : -1;
    })
    .slice(0, 10)
    .forEach(function(key, idx) {
      var item = maker(set[key]);
      if (idx == 0) {
        g.add(item.translate([0, 0, 0]), key);
      } else {
        var gsize = util.size(g.combine());
        var isize = util.size(item);
        g.add(item.translate([gsize.x + isize.x / 2, 0, 0]), key);
      }
      // var gsize = util.size(g.combine());
      // g.translate([gsize.x, 0, 0]);

      // var label = util
      //   .label(key)
      //   .fit([width - 5, 10, 10], true)
      //   .rotateX(90)
      //   .rotateZ(180)
      //   .snap(item, 'z', 'outside-')
      //   .align(item, 'xy')
      //   .translate([0,0,5]);

      // return item.translate([width * idx, offset, 0]);
    });

  return g.combine();
}

// include:js
// endinject
