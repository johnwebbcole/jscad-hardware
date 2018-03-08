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

/* exported Hardware */

/**
 * A gear moduel for openJSCAD.
 * ![parts example](jsdoc2md/hexagon.png)
 * @example
 *include('jscad-utils-color.jscad');
 *
 *function mainx(params) {
 *   util.init(CSG);
 *
 *   // draws a blue hexagon
 *   return Parts.Hexagon(10, 5).color('blue');
 *}
 * @type {Object}
 * @module jscad-hardware
 * @exports Hardware
 */
Hardware = {
  Bolt: function Bolt(length, bolt, fit, BOM) {
    fit = fit || 'loose';

    if (BOM) {
      // Keep track of bolts for bill-of-materials
      var bomkey = `${bolt.name} - ${util.cm(length).toFixed(2)}`;
      if (!BOM[bomkey]) BOM[bomkey] = 0;
      BOM[bomkey]++;
    }
    var b = Parts.Hardware[bolt.type](bolt.G || bolt.D, bolt.H, bolt.E, length);

    var clearance = bolt[fit] - bolt.E;

    b.add(
      Parts.Hardware
        [bolt.type](
          (bolt.G || bolt.D) + clearance,
          bolt.H + clearance,
          bolt[fit],
          length,
          length
        )
        .map(part => part.color('red')),
      'tap',
      false,
      'tap-'
    );

    return b;
  },

  /**
   * Create a washer group from a washer type.
   * @param {Object} washer Washer type object.
   * @param {String} fit    Clearance to add to group (tap|close|loose).
   */
  Washer: function Washer(washer, fit) {
    var w = util.group();
    w.add(
      Parts.Tube(washer.od, washer.id, washer.thickness).color('gray'),
      'washer'
    );
    if (fit) {
      var tap = Hardware.Clearances[fit];
      if (!tap)
        console.error(
          `Hardware.Washer unknown fit clearance ${fit}, should be ${Object.keys(
            Hardware.Clarances
          ).join('|')}`
        );
      w.add(
        Parts.Cylinder(
          washer.od + Hardware.Clearances[fit],
          washer.thickness
        ).color('red'),
        'clearance'
      );
    }
    return w;
  },

  Nut: function Nut(nut, fit) {
    return Parts.Hexagon(nut[1] + Hardware.Clearances[fit], nut[2]);
  },

  Screw: {
    PanHead: function(type, length, fit, options = {}) {
      var [headDiameter, headLength, diameter, tap, countersink] = type;
      return Hardware.PanHeadScrew(
        headDiameter,
        headLength,
        diameter,
        length,
        options.clearLength,
        options
      );
    },

    FlatHead: function(type, length, fit, options = {}) {
      var [headDiameter, headLength, diameter, tap, countersink] = type;
      return Hardware.FlatHeadScrew(
        headDiameter,
        headLength,
        diameter,
        length,
        options.clearLength,
        options
      );
    }
    // HexHead: Hardware.ScrewType(Hardware.PanHeadScrew, ...args)
  },

  Clearances: {
    tap: util.inch(-0.049),
    close: util.inch(0.007),
    loose: util.inch(0.016)
  },

  Orientation: {
    up: {
      head: 'outside-',
      clear: 'inside+'
    },
    down: {
      head: 'outside+',
      clear: 'inside-'
    }
  },

  CreateScrew: function(head, thread, headClearSpace, options) {
    options = util.defaults(options, {
      orientation: 'up',
      clearance: [0, 0, 0]
    });

    var orientation = Parts.Hardware.Orientation[options.orientation];
    var group = util.group('head,thread', {
      head: head.color('gray'),
      thread: thread.snap(head, 'z', orientation.head).color('silver')
    });

    if (headClearSpace) {
      group.add(
        headClearSpace
          .enlarge(options.clearance)
          .snap(head, 'z', orientation.clear)
          .color('red'),
        'headClearSpace',
        true
      );
    }

    return group;
  },

  /**
     * Creates a `Group` object with a Pan Head Screw.
     * @param {number} headDiameter Diameter of the head of the screw
     * @param {number} headLength   Length of the head
     * @param {number} diameter     Diameter of the threaded shaft
     * @param {number} length       Length of the threaded shaft
     * @param {number} clearLength  Length of the clearance section of the head.
     * @param {object} options      Screw options include orientation and clerance scale.
     */
  PanHeadScrew: function(
    headDiameter,
    headLength,
    diameter,
    length,
    clearLength,
    options
  ) {
    var head = Parts.Cylinder(headDiameter, headLength);
    var thread = Parts.Cylinder(diameter, length);

    if (clearLength) {
      var headClearSpace = Parts.Cylinder(headDiameter, clearLength);
    }

    return Hardware.CreateScrew(head, thread, headClearSpace, options);
  },

  /**
     * Creates a `Group` object with a Hex Head Screw.
     * @param {number} headDiameter Diameter of the head of the screw
     * @param {number} headLength   Length of the head
     * @param {number} diameter     Diameter of the threaded shaft
     * @param {number} length       Length of the threaded shaft
     * @param {number} clearLength  Length of the clearance section of the head.
     * @param {object} options      Screw options include orientation and clerance scale.
     */
  HexHeadScrew: function(
    headDiameter,
    headLength,
    diameter,
    length,
    clearLength,
    options
  ) {
    var head = Parts.Hexagon(headDiameter, headLength);
    var thread = Parts.Cylinder(diameter, length);

    if (clearLength) {
      var headClearSpace = Parts.Hexagon(headDiameter, clearLength);
    }

    return Hardware.CreateScrew(head, thread, headClearSpace, options);
  },

  /**
     * Create a Flat Head Screw
     * @param {number} headDiameter head diameter
     * @param {number} headLength   head length
     * @param {number} diameter     thread diameter
     * @param {number} length       thread length
     * @param {number} clearLength  clearance length
     * @param {object} options      options
     */
  FlatHeadScrew: function(
    headDiameter,
    headLength,
    diameter,
    length,
    clearLength,
    options
  ) {
    var a = headDiameter;
    var b = diameter;
    if (options && options.orientation == 'down') {
      a = diameter;
      b = headDiameter;
    }
    var head = Parts.Cone(a, b, headLength);
    // var head = Parts.Cylinder(headDiameter, headLength);
    var thread = Parts.Cylinder(diameter, length);

    if (clearLength) {
      var headClearSpace = Parts.Cylinder(headDiameter, clearLength);
    }

    return Hardware.CreateScrew(head, thread, headClearSpace, options);
  }
};

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