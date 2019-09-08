import { util, Group, parts as Parts, Debug } from '@jwc/jscad-utils';
const debug = Debug('jscadHardware:hardware');
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
export function Bolt(length, bolt, fit, BOM) {
  fit = fit || 'loose';

  if (BOM) {
    // Keep track of bolts for bill-of-materials
    var bomkey = `${bolt.name} - ${util.cm(length).toFixed(2)}`;
    if (!BOM[bomkey]) BOM[bomkey] = 0;
    BOM[bomkey]++;
  }

  var b = this[bolt.type](bolt.G || bolt.D, bolt.H, bolt.E, length);

  var clearance = bolt[fit] - bolt.E;

  b.add(
    this[bolt.type](
      (bolt.G || bolt.D) + clearance,
      bolt.H + clearance,
      bolt[fit],
      length,
      length
    ).map(part => part.color('red')),
    'tap',
    false,
    'tap-'
  );

  return b;
}

/**
 * Create a washer group from a washer type.
 * @param {Object} washer Washer type object.
 * @param {String} fit    Clearance to add to group (tap|close|loose).
 */
export function Washer(washer, fit) {
  debug('Washer', washer, fit);
  var w = Group();
  w.add(
    Parts.Tube(washer.od, washer.id, washer.thickness).color('gray'),
    'washer'
  );

  if (fit) {
    var tap = Clearances[fit];
    if (!tap)
      console.error(
        `Washer unknown fit clearance ${fit}, should be ${Object.keys(
          Clearances
        ).join('|')}`
      );
    w.add(
      Parts.Cylinder(washer.od + Clearances[fit], washer.thickness).color(
        'red'
      ),
      'clearance'
    );
  }
  return w;
}

export function Nut(nut, fit) {
  debug('Nut', nut, fit);
  return Parts.Hexagon(nut[1] + Clearances[fit], nut[2]);
}

export const Screw = {
  PanHead: function(type, length, fit, options = {}) {
    debug('PanHead', type, length, fit, options);
    var [headDiameter, headLength, diameter, tap, countersink] = type;
    return PanHeadScrew(
      headDiameter,
      headLength,
      diameter,
      length,
      options.clearLength,
      options
    );
  },

  FlatHead: function(type, length, fit, options = {}) {
    debug('FlatHead', type, length, fit, options);
    var [headDiameter, headLength, diameter, tap, countersink] = type;
    return FlatHeadScrew(
      headDiameter,
      headLength,
      diameter,
      length,
      options.clearLength,
      options
    );
  }
  // HexHead: ScrewType(PanHeadScrew, ...args)
};

export const Clearances = {
  tap: util.inch(-0.049),
  close: util.inch(0.007),
  loose: util.inch(0.016)
};

export const Orientation = {
  up: {
    head: 'outside-',
    clear: 'inside+'
  },
  down: {
    head: 'outside+',
    clear: 'inside-'
  }
};

export function CreateScrew(head, thread, headClearSpace, options = {}) {
  console.warn('head', head);
  options = Object.assign(options, {
    orientation: 'up',
    clearance: [0, 0, 0]
  });
  var orientation = Orientation[options.orientation];
  var group = Group('head,thread', {
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
}

/**
 * Creates a `Group` object with a Pan Head Screw.
 * @param {number} headDiameter Diameter of the head of the screw
 * @param {number} headLength   Length of the head
 * @param {number} diameter     Diameter of the threaded shaft
 * @param {number} length       Length of the threaded shaft
 * @param {number} clearLength  Length of the clearance section of the head.
 * @param {object} options      Screw options include orientation and clerance scale.
 */
export function PanHeadScrew(
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

  return CreateScrew(head, thread, headClearSpace, options);
}

/**
 * Creates a `Group` object with a Hex Head Screw.
 * @param {number} headDiameter Diameter of the head of the screw
 * @param {number} headLength   Length of the head
 * @param {number} diameter     Diameter of the threaded shaft
 * @param {number} length       Length of the threaded shaft
 * @param {number} clearLength  Length of the clearance section of the head.
 * @param {object} options      Screw options include orientation and clerance scale.
 */
export function HexHeadScrew(
  headDiameter,
  headLength,
  diameter,
  length,
  clearLength,
  options
) {
  debug(
    'HexHeadScrew',
    headDiameter,
    headLength,
    diameter,
    length,
    clearLength,
    options
  );
  var head = Parts.Hexagon(headDiameter, headLength);
  var thread = Parts.Cylinder(diameter, length);

  if (clearLength) {
    var headClearSpace = Parts.Hexagon(headDiameter, clearLength);
  }

  return CreateScrew(head, thread, headClearSpace, options);
}

/**
 * Create a Flat Head Screw
 * @param {number} headDiameter head diameter
 * @param {number} headLength   head length
 * @param {number} diameter     thread diameter
 * @param {number} length       thread length
 * @param {number} clearLength  clearance length
 * @param {object} options      options
 */
export function FlatHeadScrew(
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

  return CreateScrew(head, thread, headClearSpace, options);
}
