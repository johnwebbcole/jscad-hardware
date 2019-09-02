/* exported ImperialBolts, ImperialWashers */
/**
 * http://www.americanfastener.com/cap-screws/
 * E - Body Diameter
 * F - Width Across Flats
 * G - Width Across Corners
 * H - Head Height
 * D - Head Diameter
 * 
 * tap sizes: https://littlemachineshop.com/reference/TapDrillSizes.pdf
 * @type {Object}
 */
ImperialBolts = {
  '1/4 hex': {
    name: '1/4 hex',
    E: util.inch(0.25),
    tap: util.inch(0.201),
    close: util.inch(0.257),
    loose: util.inch(0.266),
    H: util.inch(5 / 32),
    G: util.inch(0.505),
    F: util.inch(7 / 16),
    type: 'HexHeadScrew'
  },
  '1/4 socket': {
    name: '1/4 socket',
    E: util.inch(0.25),
    tap: util.inch(0.201),
    close: util.inch(0.257),
    loose: util.inch(0.266),
    H: util.inch(0.25),
    D: util.inch(0.375),
    type: 'PanHeadScrew'
  },
  '5/16 hex': {
    name: '5/16 hex',
    E: util.inch(0.3125),
    tap: util.inch(0.257),
    close: util.inch(0.323),
    loose: util.inch(0.332),
    H: util.inch(0.203125),
    G: util.inch(0.577), // 0.577-0.557
    F: util.inch(0.5),
    type: 'HexHeadScrew'
  }
};

/**
 * Imperial washer sizes
 *
 * @see http://almabolt.com/pages/catalog/washers/fender.htm
 * @type {Object}
 */
var ImperialWashers = {
  '1/4': {
    od: util.inch(0.734),
    id: util.inch(0.312),
    thickness: util.inch(0.08) // .051/.080
  },
  '1/4 fender': {
    od: util.inch(1.25),
    id: util.inch(0.28125),
    thickness: util.inch(0.08) // .051/.080
  },
  '5/16': {
    od: util.inch(1.25),
    id: util.inch(0.34375),
    thickness: util.inch(0.08) // .051/.080
  }
};

// headDiameter, headLength, diameter, tap, countersink
var ImperialWoodScrews = {
  '#4': [util.inch(0.225), util.inch(0.067), util.inch(0.112)],
  '#6': [util.inch(0.279), util.inch(0.083), util.inch(0.138)],
  '#8': [util.inch(0.332), util.inch(0.1), util.inch(0.164)],
  '#10': [util.inch(0.385), util.inch(0.116), util.inch(0.19)],
  '#12': [util.inch(0.438), util.inch(0.132), util.inch(0.216)]
};

/**
 * Dimensions of nuts for imperial bolts.
 * F is the width across teh faces, C is the width
 * across the points, and H is the height.  D is the
 * basic diameter.
 *
 * [F, C, H, D]
 *
 * @see https://en.wikipedia.org/wiki/Nut_(hardware)
 * @type {Object}
 */
var ImperialNuts = {
  '1/4 hex': [11.113, 12.8, 5.56, 6.35]
};
