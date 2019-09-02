/* exported MetricBolts, MetricScrews, MetricNuts */
/**
 * http://www.atlrod.com/metric-hex-bolt-dimensions/
 * E - Body Diameter (D)
 * F - Width Across Flats
 * G - Width Across Corners (C)
 * H - Head Height
 * D - Head Diameter
 *
 * tap sizes: https://littlemachineshop.com/reference/TapDrillSizes.pdf
 * @type {Object}
 */
var MetricBolts = {
  'm10 hex': {
      E: 10, // 10-9.78
      tap: 8.5,
      close: 10.5,
      loose: 11,
      H: 6.5, // 6.63-6.17
      G: 18, // 18.48-17.77
      F: 17, // 17-15.73
      type: 'HexHeadScrew'
  },
    'm12 hex': {
        E: 12, // 12-11.73
        tap: 10.3,
        close: 12.6,
        loose: 13.2,
        H: 7.5, // 7.76-4.24
        G: 20, // 20.78-20.03
        F: 19, // 19-17.73
        type: 'HexHeadScrew'
    }
};

// headDiameter, headLength, diameter, tap, countersink
var MetricScrews = {
  'm4': [8, 3.1, 4]
};

/**
 * Dimensions of nuts for imperial bolts.
 * F is the width across the faces, C is the width
 * across the points, and H is the height.  D is the
 * basic diameter.
 *
 * [F, C, H, D]
 *
 * @see https://en.wikipedia.org/wiki/Nut_(hardware)
 * @type {Object}
 */
var MetricNuts = {
  'm4': [7, 8.1, 3.2, 4]
};