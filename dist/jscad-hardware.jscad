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
var ImperialBolts = {
  '1/4 hex': {
    name: '1/4 hex',
    E: util.inch(0.25),
    tap: util.inch(0.2010),
    close: util.inch(0.2570),
    loose: util.inch(0.2660),
    H: util.inch(5 / 32),
    G: util.inch(0.505),
    F: util.inch(7 / 16),
    type: 'HexHeadScrew'
  },
  '1/4 socket': {
    name: '1/4 socket',
    E: util.inch(0.25),
    tap: util.inch(0.2010),
    close: util.inch(0.2570),
    loose: util.inch(0.2660),
    H: util.inch(0.250),
    D: util.inch(0.375),
    type: 'PanHeadScrew'
  },
  '5/16 hex': {
    name: '5/16 hex',
    E: util.inch(0.3125),
    tap: util.inch(0.2570),
    close: util.inch(0.3230),
    loose: util.inch(0.3320),
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
var Hardware = {
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
        [
          bolt.type
        ]((bolt.G || bolt.D) + clearance, bolt.H + clearance, bolt[fit], length, length)
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
      w.add(Parts.Tube(washer.od, washer.id, washer.thickness).color('gray'), 'washer');
      if (fit) {
          var tap = Hardware.Clearances[fit];
          if (!tap) console.error(`Hardware.Washer unknown fit clearance ${fit}, should be ${Object.keys(Hardware.Clarances).join('|')}`);
          w.add(Parts.Cylinder(washer.od + Hardware.Clearances[fit], washer.thickness).color('red'), 'clearance');
      }
      return w;
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

  Screw: function(head, thread, headClearSpace, options) {
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

    return Parts.Hardware.Screw(head, thread, headClearSpace, options);
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

    return Parts.Hardware.Screw(head, thread, headClearSpace, options);
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
    var head = Parts.Cone(headDiameter, diameter, headLength);
    // var head = Parts.Cylinder(headDiameter, headLength);
    var thread = Parts.Cylinder(diameter, length);

    if (clearLength) {
      var headClearSpace = Parts.Cylinder(headDiameter, clearLength);
    }

    return Parts.Hardware.Screw(head, thread, headClearSpace, options);
  }
};

/* exported MetricBolts */
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