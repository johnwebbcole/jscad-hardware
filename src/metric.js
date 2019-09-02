import { util, Debug } from '@jwc/jscad-utils';
const debug = Debug('jscadHardware:metric');
/* exported MetricBolts, MetricScrews, MetricNuts */

const ScrewTapSizes = `m1.5 0.35 1.15 56 1.25 55 1.60 1/16 1.65 52
m1.6 0.35 1.25 55 1.35 54 1.70 51 1.75 50
m1.8 0.35 1.45 53 1.55 1/16 1.90 49 2.00 5/64
m2 0.45 1.55 1/16 1.70 51 2.10 45 2.20 44
m2.2 0.45 1.75 50 1.90 48 2.30 3/32 2.40 41
m2.5 0.45 2.05 46 2.20 44 2.65 37 2.75 7/64
m3 0.60 2.40 41 2.60 37 3.15 1/8 3.30 30
m3.5 0.60 2.90 32 3.10 31 3.70 27 3.85 24
m4 0.75 3.25 30 3.50 28 4.20 19 4.40 17
m4.5 0.75 3.75 25 4.00 22 4.75 13 5.00 9
m5 0.90 4.10 20 4.40 17 5.25 5 5.50 7/32
m5.5 0.90 4.60 14 4.90 10 5.80 1 6.10 B
m6 1.00 5.00 8 5.40 4 6.30 E 6.60 G
m7 1.00 6.00 B 6.40 E 7.40 L 7.70 N
m8 1.25 6.80 H 7.20 J 8.40 Q 8.80 S
m9 1.25 7.80 N 8.20 P 9.50 3/8 9.90 25/64
m10 1.25 8.80 11/32 9.20 23/64 10.50 Z 11.00 7/16
m11 1.50 9.50 3/8 10.00 X 11.60 29/64 12.10 15/32
m12 1.50 10.50 Z 11.00 7/16 12.60 1/2 13.20 33/64
m14 1.50 12.50 1/2 13.00 33/64 14.75 37/64 15.50 39/64
m15 1.50 13.50 17/32 14.00 35/64 15.75 5/8 16.50 21/32
m16 2.00 14.00 35/64 14.75 37/64 16.75 21/32 17.50 11/16
m17 1.50 15.50 39/64 16.00 5/8 18.00 45/64 18.50 47/64
m18 2.00 16.00 5/8 16.75 21/32 19.00 3/4 20.00 25/32
m19 2.50 16.50 21/32 17.50 11/16 20.00 25/32 21.00 53/64
m20 2.00 18.00 45/64 18.50 47/64 21.00 53/64 22.00 55/64`
  .split('\n')
  .reduce((bolts, line, index) => {
    var params = line.split(' ');
    var name = `${params[0]}`;
    bolts[name] = {
      name,
      tap: parseFloat(params[2]),
      close: parseFloat(params[6]),
      loose: parseFloat(params[8])
    };
    return bolts;
  }, {});

debug('ScrewTapSizes', ScrewTapSizes);

/**
 * @see http://www.atlrod.com/metric-hex-bolt-dimensions/
 *
 * E - Body Diameter
 * F - Width Across Flats
 * G - Width Across Corners
 * H - Head Height
 * D - Head Diameter
 *
 * NOMINAL SIZE (D)	BODY DIAMETER		HEAD THICKNESS		ACROSS THE FLATS		ACROSS CORNERS
 */
const MetricHexBoltDimensions = `m10	10.00	9.78	6.63	6.17	17.00	15.73	18.48	17.77
m12	12.00	11.73	7.76	4.24	19.00	17.73	20.78	20.03
m14	14.00	13.73	9.09	8.51	22.00	20.67	24.25	23.35
m16	16.00	15.73	10.32	9.68	24.00	23.67	27.71	26.75
m20	20.00	19.67	12.88	12.12	30.00	29.16	34.64	32.95
m24	24.00	23.67	15.44	14.56	36.00	35.00	41.57	39.55
m30	30.00	29.67	19.48	17.92	46.00	45.00	53.12	50.85
m36	36.00	35.61	23.38	21.63	55.00	53.80	63.51	60.79
m42	42.00	41.38	26.97	25.03	65.00	62.90	75.06	71.71
m48	48.00	47.38	31.07	28.93	75.00	72.60	86.60	82.76
m56	56.00	55.26	36.2	33.80	85.00	82.20	98.15	93.71
m64	64.00	63.26	41.32	38.68	95.00	91.80	109.70	104.65
m72	72.00	71.26	46.45	43.55	105.00	101.40	121.24	115.60
m80	80.00	79.26	51.58	48.42	115.00	111.00	132.72	126.54
m90	90.00	89.13	57.74	54.26	130.00	125.50	150.11	143.07
m100	90.00	99.13	63.9	60.10	145.00	140.00	167.43	159.60`
  .split('\n')
  .reduce((bolts, line) => {
    var params = line.split('\t');
    var name = `${params[0]} hex`;
    var tap = ScrewTapSizes[params[0]] || {
      tap: parseFloat(params[1]),
      close: parseFloat(params[1]),
      loose: parseFloat(params[1])
    };
    bolts[name] = {
      ...tap,
      name,
      E: parseFloat(params[1]),
      F: parseFloat(params[5]),
      G: parseFloat(params[7]),
      H: parseFloat(params[3]),
      type: 'HexHeadScrew'
    };
    return bolts;
  }, {});

debug('MetricHexBoltDimensions', MetricHexBoltDimensions);

/**
 * @see https://www.fastenal.com/content/product_specifications/M.SHCS.4762.8.8.Z.pdf
 *
 * Nominal Size (d), Body Diameter Max, min, Head Diameter max, min, Head Height max, min, Socket Size max, min, Key Engagement min
 *
 * E - Body Diameter
 * H - Head Height
 * D - Head Diameter
 */
const SocketCapScrewDimensions = `m1.6 1.60 1.46 3.14 2.86 1.60 1.46 1.58 1.52 0.7
m2 2.00 1.86 3.98 3.62 2.00 1.86 1.58 1.52 1
m2.5 2.50 2.36 4.68 4.32 2.50 2.36 2.08 2.02 1.1
m3 3.00 2.86 5.68 5.32 3.00 2.86 2.58 2.52 1.3
m4 4.00 3.82 7.22 6.78 4.00 3.82 3.08 3.02 2
m5 5.00 4.82 8.72 8.28 5.00 4.82 4.095 4.020 2.5
m6 6.00 5.82 10.22 9.78 6.00 5.70 5.14 5.02 3
m8 8.00 7.78 13.27 12.73 8.00 7.64 6.14 6.02 4
m10 10.00 9.78 16.27 15.73 10.00 9.64 8.175 8.025 5
m12 12.00 11.73 18.27 17.73 12.00 11.57 10.175 10.025 6
m14 14.00 13.73 21.33 20.67 14.00 13.57 12.212 12.032 7
m16 16.00 15.73 24.33 23.67 16.00 15.57 14.212 14.032 8
m20 20.00 19.67 30.33 29.67 20.00 19.48 17.23 17.05 10
m24 24.00 23.67 36.39 35.61 24.00 23.48 19.275 19.065 12
m30 30.00 29.67 45.39 44.61 30.00 29.48 22.275 22.065 15.5
m36 36.00 35.61 54.46 53.54 36.00 35.38 27.275 27.065 19
m42 42.00 41.61 63.46 62.54 42.00 41.38 32.33 32.08 24`
  .split('\n')
  .reduce((screws, line, index) => {
    var params = line.split(' ');
    var name = `${params[0]} socket`;
    var tap = ScrewTapSizes[params[0]] || {
      tap: parseFloat(params[1]),
      close: parseFloat(params[1]),
      loose: parseFloat(params[1])
    };
    screws[name] = {
      ...tap,
      name,
      E: parseFloat(params[1]),
      H: parseFloat(params[5]),
      D: parseFloat(params[3]),
      type: 'PanHeadScrew'
    };
    return screws;
  }, {});

debug('SocketCapScrewDimensions', SocketCapScrewDimensions);

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
export const MetricBolts = {
  ...MetricHexBoltDimensions,
  ...SocketCapScrewDimensions
  // 'm10 hex': {
  //   E: 10, // 10-9.78
  //   tap: 8.5,
  //   close: 10.5,
  //   loose: 11,
  //   H: 6.5, // 6.63-6.17
  //   G: 18, // 18.48-17.77
  //   F: 17, // 17-15.73
  //   type: 'HexHeadScrew'
  // },
  // 'm12 hex': {
  //   E: 12, // 12-11.73
  //   tap: 10.3,
  //   close: 12.6,
  //   loose: 13.2,
  //   H: 7.5, // 7.76-4.24
  //   G: 20, // 20.78-20.03
  //   F: 19, // 19-17.73
  //   type: 'HexHeadScrew'
  // }
};

// headDiameter, headLength, diameter, tap, countersink
export const MetricScrews = {
  m4: [8, 3.1, 4]
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
export const MetricNuts = {
  m4: [7, 8.1, 3.2, 4]
};

/**
 * Metric washer sizes
 * Size	Inside Diameter	Outside Diameter	Thickness
 * @see https://armstrongmetalcrafts.com/Reference/WasherSizes.aspx
 * @type {Object}
 */
export const MetricWashers = `M1	1.1mm	3.2mm	0.3mm
M1.2	1.3mm	3.8mm	0.3mm
M1.4	1.5mm	3.8mm	0.3mm
M1.6	1.7mm	4.0mm	0.3mm
M2	2.2mm	5.0mm	0.3mm
M2.5	2.7mm	6.0mm	0.5mm
M3	3.2mm	7.0mm	0.5mm
M3.5	3.7mm	8.0mm	0.5mm
M4	4.3mm	9.0mm	0.8mm
M5	5.3mm	10mm	1mm
M6	6.4mm	12mm	1.6mm
M7	7.4mm	14mm	1.6mm
M8	8.4mm	16mm	1.6mm
M10	10.5mm	20mm	2.0mm
M11	12mm	24mm	2.5mm
M12	13mm	24mm	2.5mm
M14	15mm	28mm	2.5mm
M16	17mm	30mm	3.0mm
M18	19mm	34mm	3.0mm
M20	21mm	37mm	3.0mm`
  .split('\n')
  .reduce(function ParseWasher(washers, line) {
    const [size, id, od, thickness] = line
      .replace(/mm/g, '')
      .split('\t')
      .map(function parseValues(field, index) {
        return index == 0 ? field : parseFloat(field);
      });
    washers[size] = { size, id, od, thickness };
    return washers;
  }, {});
