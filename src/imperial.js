import { util, Debug } from '@jwc/jscad-utils';
const debug = Debug('jscadHardware:imperial');

/* exported ImperialBolts, ImperialWashers */

function parseImperial(field) {
  var value = [/(\d+)-(\d+)\/(\d+)/, /(\d+)\/(\d+)/, /(\d+)/].reduce(
    function parseImperial(value, re, idx) {
      if (!value) {
        var match = field.match(re);
        if (match && idx == 0)
          value = parseInt(match[1]) + parseInt(match[2]) / parseInt(match[3]);

        if (match && idx == 1) value = parseInt(match[1]) / parseInt(match[2]);

        if (match && idx == 2) value = parseInt(match[1]);
      }
      return value;
    },
    undefined
  );
  return util.inch(value);
}

function parseValues(field, index) {
  if (index == 0) return field;
  if (field == '-') return;
  return parseImperial(field);
}

const ScrewTapSizes = `0	.0600	80	.0447	3/64	.0469	55	.0520	52	.0635	50	.0700
1	.0730	64	.0538	53	.0595	1/16	.0625	48	.0760	46	.0810
2	.0860	56	.0641	50	.0700	49	.0730	43	.0890	41	.0960
3	.0990	48	.0734	47	.0785	44	.0860	37	.1040	35	.1100
4	.1120	40	.0813	43	.0890	41	.0960	32	.1160	30	.1285
5	.125	40	.0943	38	.1015	7/64	.1094	30	.1285	29	.1360
6	.138	32	.0997	36	.1065	32	.1160	27	.1440	25	.1495
8	.1640	32	.1257	29	.1360	27	.1440	18	.1695	16	.1770
10	.1900	24	.1389	25	.1495	20	.1610	9	.1960	7	.2010
12	.2160	24	.1649	16	.1770	12	.1890	2	.2210	1	.2280
1/4	.2500	20	.1887	7	.2010	7/32	.2188	F	.2570	H	.2660
5/16	.3125	18	.2443	F	.2570	J	.2770	P	.3230	Q	.3320
3/8	.3750	16	.2983	5/16	.3125	Q	.3320	W	.3860	X	.3970
7/16	.4375	14	.3499	U	.3680	25/64	.3906	29/64	.4531	15/32	.4687
1/2	.5000	13	.4056	27/64	.4219	29/64	.4531	33/64	.5156	17/32	.5312
9/16	.5625	12	.4603	31/64	.4844	33/64	.5156	37/64	.5781	19/32	.5938
5/8	.6250	11	.5135	17/32	.5312	9/16	.5625	41/64	.6406	21/32	.6562
11/16	.6875	24	.6364	41/64	.6406	21/32	.6562	45/64	.7031	23/32	.7188
3/4	.7500	10	.6273	21/32	.6562	11/16	.6875	49/64	.7656	25/32	.7812
13/16	.8125	20	.7512	49/64	.7656	25/32	.7812	53/64	.8281	27/32	.8438
7/8	.8750	9	.7387	49/64	.7656	51/64	.7969	57/64	.8906	29/32	.9062
15/16	.9375	20	.8762	57/64	.8906	29/32	.9062	61/64	.9531	31/32	.9688
1	1.000	8	.8466	7/8	.8750	59/64	.9219	1-1/64	1.0156	1-1/32	1.0313`
  .split('\n')
  .reduce((bolts, line, index) => {
    var params = line.split('\t');
    var name = `${index < 10 ? '#' : ''}${params[0]}`;
    bolts[name] = {
      name,
      tap: util.inch(parseFloat(params[5])),
      close: util.inch(parseFloat(params[9])),
      loose: util.inch(parseFloat(params[11]))
    };
    return bolts;
  }, {});

/**
 * Screw Size, Major Diameter, Threads Per Inch, Minor Diameter, Tap Plastic Drill Size, Tap Plastic Decimal Equiv., Tap Steel Drill Size, Tap Steel Decimal Equiv., Close Fit Drill Size, Close Fit Decimal Equiv., Free Fit Drill Size, Free Fit Decimal Equiv.
 *
 * @see http://www.americanfastener.com/cap-screws/
 * @see https://www.aftfasteners.com/fully-threaded-hex-tap-bolts-dimensions-mechanical-properties/
 * E - Body Diameter
 * F - Width Across Flats
 * G - Width Across Corners
 * H - Head Height
 * D - Head Diameter
 *
 * tap sizes: @see https://littlemachineshop.com/reference/tapdrill.php
 * @type {Object}
 */
const HexBoltDimensions = `1/4	7/16	.438	.428	.505	.488	5/32	.163	.150
5/16	1/2	.500	.489	.577	.557	13/64	.211	.195
3/8	9/16	.562	.551	.650	.628	15/64	.243	.226
7/16	5/8	.625	.612	.722	.698	9/32	.291	.272
1/2	3/4	.750	.736	.866	.840	5/16	.323	.302
9/16	13/16	.812	.798	.938	.910	23/64	.371	.348
5/8	15/16	.938	.922	1.083	1.051	25/64	.403	.378
3/4	1-1/8	1.125	1.100	1.299	1.254	15/32	.483	.455
7/8	1-5/16	1.312	1.269	1.516	1.447	37/64	.604	.531
1	1-1/2	1.500	1.450	1.732	1.653	43/64	.700	.591
1-1/4	1-7/8	1.875	1.812	2.165	2.066	27/32	.876	.749`
  .split('\n')
  .reduce((bolts, line) => {
    var params = line.split('\t');
    var name = `${params[0]} hex`;
    var tap = ScrewTapSizes[params[0]] || {
      tap: parseImperial(params[0]),
      close: parseImperial(params[0]),
      loose: parseImperial(params[0])
    };
    bolts[name] = {
      ...tap,
      name,
      E: parseImperial(params[0]),
      F: parseImperial(params[1]),
      G: util.inch(parseFloat(params[4])),
      H: parseImperial(params[6]),
      type: 'HexHeadScrew'
    };
    return bolts;
  }, {});

/**
 * Socket cap screw dimensions.
 *
 * E - Body Diameter
 * H - Head Height
 * D - Head Diameter
 *
 * @see https://www.aftfasteners.com/socket-cap-screws-dimensions-and-mechanical-properties/
 */
const SocketCapScrewDimensions = `0	0.0600	0.0568	0.096	0.091	0.060	0.057	0.004	0.050	0.074	0.062	0.025	0.020	0.007
1	0.0730	0.0695	0.118	0.112	0.073	0.070	0.005	1/16	0.087	0.075	0.031	0.025	0.007
2	0.0860	0.0822	0.140	0.134	0.086	0.083	0.008	5/64	0.102	0.090	0.038	0.029	0.007
3	0.0990	0.0949	0.161	0.154	0.099	0.095	0.008	5/64	0.115	0.102	0.044	0.034	0.007
4	0.1120	0.1075	0.183	0.176	0.112	0.108	0.009	3/832	0.130	0.117	0.051	0.038	0.008
5	0.1250	0.1202	0.205	0.198	0.125	0.121	0.012	3/32	0.145	0.132	0.057	0.043	0.008
6	0.1380	0.1329	0.226	0.218	0.138	0.134	0.013	7/64	0.158	0.144	0.064	0.047	0.008
8	0.1640	0.1585	0.270	0.262	0.164	0.159	0.014	9/64	0.188	0.172	0.077	0.056	0.008
10	0.1900	0.1840	0.312	0.303	0.207	0.185	0.018	5/32	0.218	0.202	0.090	0.065	0.008
1/4	0.2500	0.2435	0.375	0.365	0.250	0.244	0.025	3/16	0.278	0.261	0.120	0.095	0.010
5/16	0.3125	0.3053	0.469	0.457	0.312	0.306	0.033	1/4	0.347	0.329	0.151	0.119	0.010
3/8	0.3750	0.3678	0.562	0.550	0.375	0.368	0.040	5/16	0.415	0.397	0.182	0.143	0.010
7/16	0.4375	0.4294	0.656	0.642	0.438	0.430	0.047	3/8	0.484	0.465	0.213	0.166	0.015
1/2	0.5000	0.4919	0.750	0.735	0.500	0.492	0.055	3/8	0.552	0.531	0.245	0.190	0.015
5/8	0.6250	0.6163	0.938	0.921	0.625	0.616	0.070	1/2	0.689	0.664	0.307	0.238	0.015
3/4	0.7500	0.7406	1.125	1.107	0.750	0.740	0.085	5/8	0.828	0.800	0.370	0.285	0.015
7/8	0.8750	0.8647	1.312	1.293	0.875	0.864	0.100	3/4	0.963	0.932	0.432	0.333	0.020
1	1.0000	0.9886	1.500	1.479	1.000	0.988	0.114	3/4	1.100	1.068	0.495	0.380	0.020
1-1/4	1.2500	1.2336	1.875	1.852	1.250	1.236	0.144	7/8	1.370	1.333	0.620	0.475	0.020
1-1/2	1.5000	1.4818	2.250	2.224	1.500	1.485	0.176	1	1.640	1.601	0.745	0.570	0.020`
  .split('\n')
  .reduce((screws, line, index) => {
    var params = line.split('\t');
    var name = `${index < 9 ? '#' : ''}${params[0]} socket`;
    var tap = ScrewTapSizes[params[0]] || {
      tap: util.inch(parseFloat(params[3])),
      close: util.inch(parseFloat(params[3])),
      loose: util.inch(parseFloat(params[3]))
    };
    screws[name] = {
      ...tap,
      name,
      E: util.inch(parseFloat(params[1])),
      H: util.inch(parseFloat(params[5])),
      D: util.inch(parseFloat(params[3])),
      type: 'PanHeadScrew'
    };
    return screws;
  }, {});

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
export const ImperialBolts = {
  ...HexBoltDimensions,
  ...SocketCapScrewDimensions
};

/**
 * Imperial washer sizes
 * Size	Inside Diameter	Outside Diameter	Thickness
 * @see https://armstrongmetalcrafts.com/Reference/WasherSizes.aspx
 * @see http://almabolt.com/pages/catalog/washers/fender.htm
 * @type {Object}
 */
export const ImperialWashers = Object.assign(
  `3/16	1/4"	9/16"	3/64"
1/4	5/16"	3/4"	1/16"
5/16	3/8"	7/8"	5/64"
3/8	7/16"	1"	5/64"
7/16	1/2"	1-1/4"	5/64"
1/2	9/16"	1-3/8"	7/64"
9/16	5/8"	1-1/2"	7/64"
5/8	11/16"	1-3/4"	9/64"
3/4	13/16"	2"	5/32"
7/8	15/16"	2-1/4"	1/64"
1	1-1/16"	2-1/2"	11/64"
1-1/8	1-1/4"	2-3/4"	11/64"
1-1/4	1-3/8"	3"	11/64"
1-3/8	1-1/2"	2-1/4"	3/16"
1-1/2	1-5/8"	3-1/2"	3/16"
1-5/8	1-3/4"	3-3/4"	3/16"
1-3/4	1-7/8"	4"	3/16"
2	2-1/8"	4-1/2"	3/16"
2-1/2	2-5/8"	4-1/2"	3/16"
3	3-1/8"	5-1/2"	9/32"`
    .split('\n')
    .reduce(function ParseWasher(washers, line) {
      const [size, id, od, thickness] = line
        .replace(/\"/g, '')
        .split('\t')
        .map(parseValues);
      washers[size] = { size, id, od, thickness };
      return washers;
    }, {}),
  {
    '1/4 fender': {
      size: '1/4 fender',
      od: util.inch(1.25),
      id: util.inch(0.28125),
      thickness: util.inch(0.08) // .051/.080
    }
  }
);

const WoodScrewDiameter = `2	.086	26	.090	.079	.090	.079	.075	.064	.010
3	.099	24	.103	.092	.103	.092	.086	.075	.014
4	.112	22	.116	.105	.116	.105	.095	.084	.016
5	.125	20	.129	.118	.129	.118	.107	.096	.018
6	.138	18	.142	.131	.142	.131	.118	.107	.020
7	.151	16	.155	.144	.155	.144	.127	.116	.022
8	.164	15	.168	.157	.168	.157	.136	.125	.023
9	.177	14	.181	.170	.181	.170	.147	.136	.026
10	.190	13	.194	.183	.194	.183	.157	.146	.030
12	.216	11	.220	.209	.220	.209	.176	.165	.031
14	.242	10	 .246	.235 	 .246	 .235	 .201	 .190	 .035
16	.268	9	 .272	.261	 .272	 .261	 .214	 .203	 .038`
  .split('\n')
  .reduce((values, line) => {
    var params = line.split('\t');
    values[`#${params[0]}`] = util.inch(parseFloat(params[1]));
    return values;
  }, {});

/**
 * Imperial wood screws.
 * @see https://www.aftfasteners.com/wood-screws-dimensions-mechanical-specs/
 * headDiameter, headLength, diameter, tap, countersink
 */
export const ImperialWoodScrews = `2	1	.172	.147	.051	.031	.023	.023	.015	.102	.089 	.063	.047	.017
3	1	.199	.141	.059	.035	.027	.027	.017	.107	.094 	.068	.052	.018
4	1	.225	.195	.067	.039	.031	.030	.020	.128	.115 	.089 	.073	.018
5	2	.252	.220	.075	.043	.035	.034	.022	.154	.141 	.086	.063	.027
6	2	.279	.244	.083	.048	.039	.038	.024	.174	.161	.106	.083	.029
7	2	.305	.268	.091	.048	.039	.041	.027	.189	.176	.121	.098	.030
8	2	.332	.292	.100	.054	.045	.045	.029	.204	.191	.136	.113	.032
9	2	.358	.316	.108	.054	.045	.049	.032	.214	.201	.146	.123	.033
10	3	.385	.340	.116	.060	.050	.053	.034	.258	.245	.146	.123	.034
12	3	.438	.389	.132	.067	.056	.060	.039	.283	.270	.171	.148	.036
14	3	.507	.452	.153	.075	.064	.070	.046	.283	.270	.171	.148	.036
16	3	.544	.485	.164	.075	.064	.075	.049	.303	.290	.191	.168	.039`
  .split('\n')
  .reduce((screws, line) => {
    var params = line
      .split('\t')
      .map((value, index) => (index > 1 ? parseFloat(value) : value));
    screws[`#${params[0]}`] = [
      util.inch(params[2]),
      util.inch(params[4]),
      WoodScrewDiameter[`#${params[0]}`]
    ];
    return screws;
  }, {});

/**
 * Dimensions of nuts for imperial bolts.
 * F is the width across teh faces, C is the width
 * across the points, and H is the height.  D is the
 * basic diameter.
 *
 * [F, C, H, D]
 *
 * @see https://en.wikipedia.org/wiki/Nut_(hardware)
 * @see https://www.boltdepot.com/fastener-information/nuts-washers/us-nut-dimensions.aspx
 * @type {Object}
 */
export const ImperialNuts = `#0	-	5/32"	-	-	-	3/64"
#1	-	5/32"	-	-	-	3/64"
#2	-	3/16"	-	-	9/64"	1/16"
#3	-	3/16"	-	-	9/64"	1/16"
#4	-	1/4"	-	-	9/64"	3/32"
#6	-	5/16"	-	-	11/64"	7/64"
#8	-	11/32"	-	-	15/64"	1/8"
#10	-	3/8"	-	-	15/64"	1/8"
#12	-	7/16"	-	-	5/16"	5/32"
1/4	7/16"	7/16"	7/32"	5/32"	5/16"	3/16"
5/16	1/2"	9/16"	17/64"	3/16"	11/32"	7/32"
3/8	9/16"	5/8"	21/64"	7/32"	29/64"	1/4"
7/16	11/16"	-	3/8"	1/4"	29/64"	-
1/2	3/4"	-	7/16"	5/16"	19/32"	-
9/16	7/8"	-	31/64"	5/16"	41/64"	-
5/8	15/16"	-	35/64"	3/8"	3/4"	-
3/4	1-1/8"	-	41/64"	27/64"	7/8"	-
7/8	1-5/16"	-	3/4"	31/64"	63/64"	-
1	1-1/2"	-	55/64"	35/64"	1-3/64"	-`
  .split('\n')
  .reduce((nuts, line) => {
    var params = line.split('\t').map(parseValues);
    var flatDiameter = params[1] || params[2];
    var cornerDiameter = flatDiameter / (Math.sqrt(3) / 2);
    var height = params[3] || params[6];
    nuts[`${params[0]} hex`] = [
      flatDiameter,
      cornerDiameter,
      height,
      cornerDiameter / 2 // the boltdepot data does not have the hole diameter
    ];
    return nuts;
  }, {});
