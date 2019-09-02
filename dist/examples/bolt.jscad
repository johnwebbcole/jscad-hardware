function main() {
  util.init(CSG, { debug: '*' });
  var bolt = Hardware.Bolt(util.inch(1), ImperialBolts['1/4 hex'], 'close');
  var bolt2 = Hardware.Bolt(
    util.inch(1),
    MetricBolts['m8 socket'],
    'close'
  ).snap('head', bolt.parts.head, 'x', 'outside+', -10);

  return [bolt.combine('head,thread'), bolt2.combine('head,thread')];
}

// include:js
// ../dist/v1compat.js
/* eslint-disable */
var Hardware,
  ImperialBolts,
  ImperialNuts,
  ImperialWashers,
  ImperialWoodScrews,
  MetricBolts,
  MetricNuts,
  MetricWashers,
  MetricWoodScrews;
function initJscadHardware() {
  var Debug = util.Debug;
  var debug = Debug('jscadHardware:initJscadHardware');
  var jscadUtils = { util, Debug, parts: Parts, Group };
  var jsCadCSG = { CSG, CAG };
  debug('initJscadHardware:jscadUtils', jscadUtils);

  // include:compat
  // ../dist/index.js
/* 
 * jscad-hardware version 1.1.0 
 * https://github.com/johnwebbcole/jscad-hardware
 */
var jscadHardware = (function (exports, csg, jscadUtils) {
  'use strict';

  csg = csg && csg.hasOwnProperty('default') ? csg['default'] : csg;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var debug = jscadUtils.Debug('jscadHardware:hardware');
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

  function Bolt(length, bolt, fit, BOM) {
    fit = fit || 'loose';

    if (BOM) {
      // Keep track of bolts for bill-of-materials
      var bomkey = "".concat(bolt.name, " - ").concat(jscadUtils.util.cm(length).toFixed(2));
      if (!BOM[bomkey]) BOM[bomkey] = 0;
      BOM[bomkey]++;
    }

    var b = this[bolt.type](bolt.G || bolt.D, bolt.H, bolt.E, length);
    var clearance = bolt[fit] - bolt.E;
    b.add(this[bolt.type]((bolt.G || bolt.D) + clearance, bolt.H + clearance, bolt[fit], length, length).map(function (part) {
      return part.color('red');
    }), 'tap', false, 'tap-');
    return b;
  }
  /**
   * Create a washer group from a washer type.
   * @param {Object} washer Washer type object.
   * @param {String} fit    Clearance to add to group (tap|close|loose).
   */

  function Washer(washer, fit) {
    debug('Washer', washer, fit);
    var w = jscadUtils.Group();
    w.add(jscadUtils.parts.Tube(washer.od, washer.id, washer.thickness).color('gray'), 'washer');

    if (fit) {
      var tap = Clearances[fit];
      if (!tap) console.error("Washer unknown fit clearance ".concat(fit, ", should be ").concat(Object.keys(Clearances).join('|')));
      w.add(jscadUtils.parts.Cylinder(washer.od + Clearances[fit], washer.thickness).color('red'), 'clearance');
    }

    return w;
  }
  function Nut(nut, fit) {
    debug('Nut', nut, fit);
    return jscadUtils.parts.Hexagon(nut[1] + Clearances[fit], nut[2]);
  }
  var Screw = {
    PanHead: function PanHead(type, length, fit) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      debug('PanHead', type, length, fit, options);

      var _type = _slicedToArray(type, 5),
          headDiameter = _type[0],
          headLength = _type[1],
          diameter = _type[2],
          tap = _type[3],
          countersink = _type[4];

      return PanHeadScrew(headDiameter, headLength, diameter, length, options.clearLength, options);
    },
    FlatHead: function FlatHead(type, length, fit) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      debug('FlatHead', type, length, fit, options);

      var _type2 = _slicedToArray(type, 5),
          headDiameter = _type2[0],
          headLength = _type2[1],
          diameter = _type2[2],
          tap = _type2[3],
          countersink = _type2[4];

      return FlatHeadScrew(headDiameter, headLength, diameter, length, options.clearLength, options);
    } // HexHead: ScrewType(PanHeadScrew, ...args)

  };
  var Clearances = {
    tap: jscadUtils.util.inch(-0.049),
    close: jscadUtils.util.inch(0.007),
    loose: jscadUtils.util.inch(0.016)
  };
  var Orientation = {
    up: {
      head: 'outside-',
      clear: 'inside+'
    },
    down: {
      head: 'outside+',
      clear: 'inside-'
    }
  };
  function CreateScrew(head, thread, headClearSpace) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    options = Object.assign(options, {
      orientation: 'up',
      clearance: [0, 0, 0]
    });
    var orientation = Orientation[options.orientation];
    var group = jscadUtils.Group('head,thread', {
      head: head.color('gray'),
      thread: thread.snap(head, 'z', orientation.head).color('silver')
    });

    if (headClearSpace) {
      group.add(headClearSpace.enlarge(options.clearance).snap(head, 'z', orientation.clear).color('red'), 'headClearSpace', true);
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

  function PanHeadScrew(headDiameter, headLength, diameter, length, clearLength, options) {
    var head = jscadUtils.parts.Cylinder(headDiameter, headLength);
    var thread = jscadUtils.parts.Cylinder(diameter, length);

    if (clearLength) {
      var headClearSpace = jscadUtils.parts.Cylinder(headDiameter, clearLength);
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

  function HexHeadScrew(headDiameter, headLength, diameter, length, clearLength, options) {
    debug('HexHeadScrew', headDiameter, headLength, diameter, length, clearLength, options);
    var head = jscadUtils.parts.Hexagon(headDiameter, headLength);
    var thread = jscadUtils.parts.Cylinder(diameter, length);

    if (clearLength) {
      var headClearSpace = jscadUtils.parts.Hexagon(headDiameter, clearLength);
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

  function FlatHeadScrew(headDiameter, headLength, diameter, length, clearLength, options) {
    var a = headDiameter;
    var b = diameter;

    if (options && options.orientation == 'down') {
      a = diameter;
      b = headDiameter;
    }

    var head = jscadUtils.parts.Cone(a, b, headLength); // var head = Parts.Cylinder(headDiameter, headLength);

    var thread = jscadUtils.parts.Cylinder(diameter, length);

    if (clearLength) {
      var headClearSpace = jscadUtils.parts.Cylinder(headDiameter, clearLength);
    }

    return CreateScrew(head, thread, headClearSpace, options);
  }

  var hardware = /*#__PURE__*/Object.freeze({
    Bolt: Bolt,
    Washer: Washer,
    Nut: Nut,
    Screw: Screw,
    Clearances: Clearances,
    Orientation: Orientation,
    CreateScrew: CreateScrew,
    PanHeadScrew: PanHeadScrew,
    HexHeadScrew: HexHeadScrew,
    FlatHeadScrew: FlatHeadScrew
  });

  var debug$1 = jscadUtils.Debug('jscadHardware:imperial');
  /* exported ImperialBolts, ImperialWashers */

  function parseImperial(field) {
    var value = [/(\d+)-(\d+)\/(\d+)/, /(\d+)\/(\d+)/, /(\d+)/].reduce(function parseImperial(value, re, idx) {
      if (!value) {
        var match = field.match(re);
        if (match && idx == 0) value = parseInt(match[1]) + parseInt(match[2]) / parseInt(match[3]);
        if (match && idx == 1) value = parseInt(match[1]) / parseInt(match[2]);
        if (match && idx == 2) value = parseInt(match[1]);
      }

      return value;
    }, undefined);
    return jscadUtils.util.inch(value);
  }

  function parseValues(field, index) {
    if (index == 0) return field;
    if (field == '-') return;
    return parseImperial(field);
  }

  var ScrewTapSizes = "0\t.0600\t80\t.0447\t3/64\t.0469\t55\t.0520\t52\t.0635\t50\t.0700\n1\t.0730\t64\t.0538\t53\t.0595\t1/16\t.0625\t48\t.0760\t46\t.0810\n2\t.0860\t56\t.0641\t50\t.0700\t49\t.0730\t43\t.0890\t41\t.0960\n3\t.0990\t48\t.0734\t47\t.0785\t44\t.0860\t37\t.1040\t35\t.1100\n4\t.1120\t40\t.0813\t43\t.0890\t41\t.0960\t32\t.1160\t30\t.1285\n5\t.125\t40\t.0943\t38\t.1015\t7/64\t.1094\t30\t.1285\t29\t.1360\n6\t.138\t32\t.0997\t36\t.1065\t32\t.1160\t27\t.1440\t25\t.1495\n8\t.1640\t32\t.1257\t29\t.1360\t27\t.1440\t18\t.1695\t16\t.1770\n10\t.1900\t24\t.1389\t25\t.1495\t20\t.1610\t9\t.1960\t7\t.2010\n12\t.2160\t24\t.1649\t16\t.1770\t12\t.1890\t2\t.2210\t1\t.2280\n1/4\t.2500\t20\t.1887\t7\t.2010\t7/32\t.2188\tF\t.2570\tH\t.2660\n5/16\t.3125\t18\t.2443\tF\t.2570\tJ\t.2770\tP\t.3230\tQ\t.3320\n3/8\t.3750\t16\t.2983\t5/16\t.3125\tQ\t.3320\tW\t.3860\tX\t.3970\n7/16\t.4375\t14\t.3499\tU\t.3680\t25/64\t.3906\t29/64\t.4531\t15/32\t.4687\n1/2\t.5000\t13\t.4056\t27/64\t.4219\t29/64\t.4531\t33/64\t.5156\t17/32\t.5312\n9/16\t.5625\t12\t.4603\t31/64\t.4844\t33/64\t.5156\t37/64\t.5781\t19/32\t.5938\n5/8\t.6250\t11\t.5135\t17/32\t.5312\t9/16\t.5625\t41/64\t.6406\t21/32\t.6562\n11/16\t.6875\t24\t.6364\t41/64\t.6406\t21/32\t.6562\t45/64\t.7031\t23/32\t.7188\n3/4\t.7500\t10\t.6273\t21/32\t.6562\t11/16\t.6875\t49/64\t.7656\t25/32\t.7812\n13/16\t.8125\t20\t.7512\t49/64\t.7656\t25/32\t.7812\t53/64\t.8281\t27/32\t.8438\n7/8\t.8750\t9\t.7387\t49/64\t.7656\t51/64\t.7969\t57/64\t.8906\t29/32\t.9062\n15/16\t.9375\t20\t.8762\t57/64\t.8906\t29/32\t.9062\t61/64\t.9531\t31/32\t.9688\n1\t1.000\t8\t.8466\t7/8\t.8750\t59/64\t.9219\t1-1/64\t1.0156\t1-1/32\t1.0313".split('\n').reduce(function (bolts, line, index) {
    var params = line.split('\t');
    var name = "".concat(index < 10 ? '#' : '').concat(params[0]);
    bolts[name] = {
      name: name,
      tap: jscadUtils.util.inch(parseFloat(params[5])),
      close: jscadUtils.util.inch(parseFloat(params[9])),
      loose: jscadUtils.util.inch(parseFloat(params[11]))
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

  var HexBoltDimensions = "1/4\t7/16\t.438\t.428\t.505\t.488\t5/32\t.163\t.150\n5/16\t1/2\t.500\t.489\t.577\t.557\t13/64\t.211\t.195\n3/8\t9/16\t.562\t.551\t.650\t.628\t15/64\t.243\t.226\n7/16\t5/8\t.625\t.612\t.722\t.698\t9/32\t.291\t.272\n1/2\t3/4\t.750\t.736\t.866\t.840\t5/16\t.323\t.302\n9/16\t13/16\t.812\t.798\t.938\t.910\t23/64\t.371\t.348\n5/8\t15/16\t.938\t.922\t1.083\t1.051\t25/64\t.403\t.378\n3/4\t1-1/8\t1.125\t1.100\t1.299\t1.254\t15/32\t.483\t.455\n7/8\t1-5/16\t1.312\t1.269\t1.516\t1.447\t37/64\t.604\t.531\n1\t1-1/2\t1.500\t1.450\t1.732\t1.653\t43/64\t.700\t.591\n1-1/4\t1-7/8\t1.875\t1.812\t2.165\t2.066\t27/32\t.876\t.749".split('\n').reduce(function (bolts, line) {
    var params = line.split('\t');
    var name = "".concat(params[0], " hex");
    var tap = ScrewTapSizes[params[0]] || {
      tap: parseImperial(params[0]),
      close: parseImperial(params[0]),
      loose: parseImperial(params[0])
    };
    bolts[name] = _objectSpread2({}, tap, {
      name: name,
      E: parseImperial(params[0]),
      F: parseImperial(params[1]),
      G: jscadUtils.util.inch(parseFloat(params[4])),
      H: parseImperial(params[6]),
      type: 'HexHeadScrew'
    });
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

  var SocketCapScrewDimensions = "0\t0.0600\t0.0568\t0.096\t0.091\t0.060\t0.057\t0.004\t0.050\t0.074\t0.062\t0.025\t0.020\t0.007\n1\t0.0730\t0.0695\t0.118\t0.112\t0.073\t0.070\t0.005\t1/16\t0.087\t0.075\t0.031\t0.025\t0.007\n2\t0.0860\t0.0822\t0.140\t0.134\t0.086\t0.083\t0.008\t5/64\t0.102\t0.090\t0.038\t0.029\t0.007\n3\t0.0990\t0.0949\t0.161\t0.154\t0.099\t0.095\t0.008\t5/64\t0.115\t0.102\t0.044\t0.034\t0.007\n4\t0.1120\t0.1075\t0.183\t0.176\t0.112\t0.108\t0.009\t3/832\t0.130\t0.117\t0.051\t0.038\t0.008\n5\t0.1250\t0.1202\t0.205\t0.198\t0.125\t0.121\t0.012\t3/32\t0.145\t0.132\t0.057\t0.043\t0.008\n6\t0.1380\t0.1329\t0.226\t0.218\t0.138\t0.134\t0.013\t7/64\t0.158\t0.144\t0.064\t0.047\t0.008\n8\t0.1640\t0.1585\t0.270\t0.262\t0.164\t0.159\t0.014\t9/64\t0.188\t0.172\t0.077\t0.056\t0.008\n10\t0.1900\t0.1840\t0.312\t0.303\t0.207\t0.185\t0.018\t5/32\t0.218\t0.202\t0.090\t0.065\t0.008\n1/4\t0.2500\t0.2435\t0.375\t0.365\t0.250\t0.244\t0.025\t3/16\t0.278\t0.261\t0.120\t0.095\t0.010\n5/16\t0.3125\t0.3053\t0.469\t0.457\t0.312\t0.306\t0.033\t1/4\t0.347\t0.329\t0.151\t0.119\t0.010\n3/8\t0.3750\t0.3678\t0.562\t0.550\t0.375\t0.368\t0.040\t5/16\t0.415\t0.397\t0.182\t0.143\t0.010\n7/16\t0.4375\t0.4294\t0.656\t0.642\t0.438\t0.430\t0.047\t3/8\t0.484\t0.465\t0.213\t0.166\t0.015\n1/2\t0.5000\t0.4919\t0.750\t0.735\t0.500\t0.492\t0.055\t3/8\t0.552\t0.531\t0.245\t0.190\t0.015\n5/8\t0.6250\t0.6163\t0.938\t0.921\t0.625\t0.616\t0.070\t1/2\t0.689\t0.664\t0.307\t0.238\t0.015\n3/4\t0.7500\t0.7406\t1.125\t1.107\t0.750\t0.740\t0.085\t5/8\t0.828\t0.800\t0.370\t0.285\t0.015\n7/8\t0.8750\t0.8647\t1.312\t1.293\t0.875\t0.864\t0.100\t3/4\t0.963\t0.932\t0.432\t0.333\t0.020\n1\t1.0000\t0.9886\t1.500\t1.479\t1.000\t0.988\t0.114\t3/4\t1.100\t1.068\t0.495\t0.380\t0.020\n1-1/4\t1.2500\t1.2336\t1.875\t1.852\t1.250\t1.236\t0.144\t7/8\t1.370\t1.333\t0.620\t0.475\t0.020\n1-1/2\t1.5000\t1.4818\t2.250\t2.224\t1.500\t1.485\t0.176\t1\t1.640\t1.601\t0.745\t0.570\t0.020".split('\n').reduce(function (screws, line, index) {
    var params = line.split('\t');
    var name = "".concat(index < 9 ? '#' : '').concat(params[0], " socket");
    var tap = ScrewTapSizes[params[0]] || {
      tap: jscadUtils.util.inch(parseFloat(params[3])),
      close: jscadUtils.util.inch(parseFloat(params[3])),
      loose: jscadUtils.util.inch(parseFloat(params[3]))
    };
    screws[name] = _objectSpread2({}, tap, {
      name: name,
      E: jscadUtils.util.inch(parseFloat(params[1])),
      H: jscadUtils.util.inch(parseFloat(params[5])),
      D: jscadUtils.util.inch(parseFloat(params[3])),
      type: 'PanHeadScrew'
    });
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

  var ImperialBolts = _objectSpread2({}, HexBoltDimensions, {}, SocketCapScrewDimensions);
  /**
   * Imperial washer sizes
   * Size	Inside Diameter	Outside Diameter	Thickness
   * @see https://armstrongmetalcrafts.com/Reference/WasherSizes.aspx
   * @see http://almabolt.com/pages/catalog/washers/fender.htm
   * @type {Object}
   */

  var ImperialWashers = Object.assign("3/16\t1/4\"\t9/16\"\t3/64\"\n1/4\t5/16\"\t3/4\"\t1/16\"\n5/16\t3/8\"\t7/8\"\t5/64\"\n3/8\t7/16\"\t1\"\t5/64\"\n7/16\t1/2\"\t1-1/4\"\t5/64\"\n1/2\t9/16\"\t1-3/8\"\t7/64\"\n9/16\t5/8\"\t1-1/2\"\t7/64\"\n5/8\t11/16\"\t1-3/4\"\t9/64\"\n3/4\t13/16\"\t2\"\t5/32\"\n7/8\t15/16\"\t2-1/4\"\t1/64\"\n1\t1-1/16\"\t2-1/2\"\t11/64\"\n1-1/8\t1-1/4\"\t2-3/4\"\t11/64\"\n1-1/4\t1-3/8\"\t3\"\t11/64\"\n1-3/8\t1-1/2\"\t2-1/4\"\t3/16\"\n1-1/2\t1-5/8\"\t3-1/2\"\t3/16\"\n1-5/8\t1-3/4\"\t3-3/4\"\t3/16\"\n1-3/4\t1-7/8\"\t4\"\t3/16\"\n2\t2-1/8\"\t4-1/2\"\t3/16\"\n2-1/2\t2-5/8\"\t4-1/2\"\t3/16\"\n3\t3-1/8\"\t5-1/2\"\t9/32\"".split('\n').reduce(function ParseWasher(washers, line) {
    var _line$replace$split$m = line.replace(/\"/g, '').split('\t').map(parseValues),
        _line$replace$split$m2 = _slicedToArray(_line$replace$split$m, 4),
        size = _line$replace$split$m2[0],
        id = _line$replace$split$m2[1],
        od = _line$replace$split$m2[2],
        thickness = _line$replace$split$m2[3];

    washers[size] = {
      size: size,
      id: id,
      od: od,
      thickness: thickness
    };
    return washers;
  }, {}), {
    '1/4 fender': {
      size: '1/4 fender',
      od: jscadUtils.util.inch(1.25),
      id: jscadUtils.util.inch(0.28125),
      thickness: jscadUtils.util.inch(0.08) // .051/.080

    }
  });
  var WoodScrewDiameter = "2\t.086\t26\t.090\t.079\t.090\t.079\t.075\t.064\t.010\n3\t.099\t24\t.103\t.092\t.103\t.092\t.086\t.075\t.014\n4\t.112\t22\t.116\t.105\t.116\t.105\t.095\t.084\t.016\n5\t.125\t20\t.129\t.118\t.129\t.118\t.107\t.096\t.018\n6\t.138\t18\t.142\t.131\t.142\t.131\t.118\t.107\t.020\n7\t.151\t16\t.155\t.144\t.155\t.144\t.127\t.116\t.022\n8\t.164\t15\t.168\t.157\t.168\t.157\t.136\t.125\t.023\n9\t.177\t14\t.181\t.170\t.181\t.170\t.147\t.136\t.026\n10\t.190\t13\t.194\t.183\t.194\t.183\t.157\t.146\t.030\n12\t.216\t11\t.220\t.209\t.220\t.209\t.176\t.165\t.031\n14\t.242\t10\t .246\t.235 \t .246\t .235\t .201\t .190\t .035\n16\t.268\t9\t .272\t.261\t .272\t .261\t .214\t .203\t .038".split('\n').reduce(function (values, line) {
    var params = line.split('\t');
    values["#".concat(params[0])] = jscadUtils.util.inch(parseFloat(params[1]));
    return values;
  }, {});
  /**
   * Imperial wood screws.
   * @see https://www.aftfasteners.com/wood-screws-dimensions-mechanical-specs/
   * headDiameter, headLength, diameter, tap, countersink
   */

  var ImperialWoodScrews = "2\t1\t.172\t.147\t.051\t.031\t.023\t.023\t.015\t.102\t.089 \t.063\t.047\t.017\n3\t1\t.199\t.141\t.059\t.035\t.027\t.027\t.017\t.107\t.094 \t.068\t.052\t.018\n4\t1\t.225\t.195\t.067\t.039\t.031\t.030\t.020\t.128\t.115 \t.089 \t.073\t.018\n5\t2\t.252\t.220\t.075\t.043\t.035\t.034\t.022\t.154\t.141 \t.086\t.063\t.027\n6\t2\t.279\t.244\t.083\t.048\t.039\t.038\t.024\t.174\t.161\t.106\t.083\t.029\n7\t2\t.305\t.268\t.091\t.048\t.039\t.041\t.027\t.189\t.176\t.121\t.098\t.030\n8\t2\t.332\t.292\t.100\t.054\t.045\t.045\t.029\t.204\t.191\t.136\t.113\t.032\n9\t2\t.358\t.316\t.108\t.054\t.045\t.049\t.032\t.214\t.201\t.146\t.123\t.033\n10\t3\t.385\t.340\t.116\t.060\t.050\t.053\t.034\t.258\t.245\t.146\t.123\t.034\n12\t3\t.438\t.389\t.132\t.067\t.056\t.060\t.039\t.283\t.270\t.171\t.148\t.036\n14\t3\t.507\t.452\t.153\t.075\t.064\t.070\t.046\t.283\t.270\t.171\t.148\t.036\n16\t3\t.544\t.485\t.164\t.075\t.064\t.075\t.049\t.303\t.290\t.191\t.168\t.039".split('\n').reduce(function (screws, line) {
    var params = line.split('\t').map(function (value, index) {
      return index > 1 ? parseFloat(value) : value;
    });
    screws["#".concat(params[0])] = [jscadUtils.util.inch(params[2]), jscadUtils.util.inch(params[4]), WoodScrewDiameter["#".concat(params[0])]];
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

  var ImperialNuts = "#0\t-\t5/32\"\t-\t-\t-\t3/64\"\n#1\t-\t5/32\"\t-\t-\t-\t3/64\"\n#2\t-\t3/16\"\t-\t-\t9/64\"\t1/16\"\n#3\t-\t3/16\"\t-\t-\t9/64\"\t1/16\"\n#4\t-\t1/4\"\t-\t-\t9/64\"\t3/32\"\n#6\t-\t5/16\"\t-\t-\t11/64\"\t7/64\"\n#8\t-\t11/32\"\t-\t-\t15/64\"\t1/8\"\n#10\t-\t3/8\"\t-\t-\t15/64\"\t1/8\"\n#12\t-\t7/16\"\t-\t-\t5/16\"\t5/32\"\n1/4\t7/16\"\t7/16\"\t7/32\"\t5/32\"\t5/16\"\t3/16\"\n5/16\t1/2\"\t9/16\"\t17/64\"\t3/16\"\t11/32\"\t7/32\"\n3/8\t9/16\"\t5/8\"\t21/64\"\t7/32\"\t29/64\"\t1/4\"\n7/16\t11/16\"\t-\t3/8\"\t1/4\"\t29/64\"\t-\n1/2\t3/4\"\t-\t7/16\"\t5/16\"\t19/32\"\t-\n9/16\t7/8\"\t-\t31/64\"\t5/16\"\t41/64\"\t-\n5/8\t15/16\"\t-\t35/64\"\t3/8\"\t3/4\"\t-\n3/4\t1-1/8\"\t-\t41/64\"\t27/64\"\t7/8\"\t-\n7/8\t1-5/16\"\t-\t3/4\"\t31/64\"\t63/64\"\t-\n1\t1-1/2\"\t-\t55/64\"\t35/64\"\t1-3/64\"\t-".split('\n').reduce(function (nuts, line) {
    var params = line.split('\t').map(parseValues);
    var flatDiameter = params[1] || params[2];
    var cornerDiameter = flatDiameter / (Math.sqrt(3) / 2);
    var height = params[3] || params[6];
    nuts["".concat(params[0], " hex")] = [flatDiameter, cornerDiameter, height, cornerDiameter / 2 // the boltdepot data does not have the hole diameter
    ];
    return nuts;
  }, {});

  var imperial = /*#__PURE__*/Object.freeze({
    ImperialBolts: ImperialBolts,
    ImperialWashers: ImperialWashers,
    ImperialWoodScrews: ImperialWoodScrews,
    ImperialNuts: ImperialNuts
  });

  var debug$2 = jscadUtils.Debug('jscadHardware:metric');
  /* exported MetricBolts, MetricScrews, MetricNuts */

  var ScrewTapSizes$1 = "m1.5 0.35 1.15 56 1.25 55 1.60 1/16 1.65 52\nm1.6 0.35 1.25 55 1.35 54 1.70 51 1.75 50\nm1.8 0.35 1.45 53 1.55 1/16 1.90 49 2.00 5/64\nm2 0.45 1.55 1/16 1.70 51 2.10 45 2.20 44\nm2.2 0.45 1.75 50 1.90 48 2.30 3/32 2.40 41\nm2.5 0.45 2.05 46 2.20 44 2.65 37 2.75 7/64\nm3 0.60 2.40 41 2.60 37 3.15 1/8 3.30 30\nm3.5 0.60 2.90 32 3.10 31 3.70 27 3.85 24\nm4 0.75 3.25 30 3.50 28 4.20 19 4.40 17\nm4.5 0.75 3.75 25 4.00 22 4.75 13 5.00 9\nm5 0.90 4.10 20 4.40 17 5.25 5 5.50 7/32\nm5.5 0.90 4.60 14 4.90 10 5.80 1 6.10 B\nm6 1.00 5.00 8 5.40 4 6.30 E 6.60 G\nm7 1.00 6.00 B 6.40 E 7.40 L 7.70 N\nm8 1.25 6.80 H 7.20 J 8.40 Q 8.80 S\nm9 1.25 7.80 N 8.20 P 9.50 3/8 9.90 25/64\nm10 1.25 8.80 11/32 9.20 23/64 10.50 Z 11.00 7/16\nm11 1.50 9.50 3/8 10.00 X 11.60 29/64 12.10 15/32\nm12 1.50 10.50 Z 11.00 7/16 12.60 1/2 13.20 33/64\nm14 1.50 12.50 1/2 13.00 33/64 14.75 37/64 15.50 39/64\nm15 1.50 13.50 17/32 14.00 35/64 15.75 5/8 16.50 21/32\nm16 2.00 14.00 35/64 14.75 37/64 16.75 21/32 17.50 11/16\nm17 1.50 15.50 39/64 16.00 5/8 18.00 45/64 18.50 47/64\nm18 2.00 16.00 5/8 16.75 21/32 19.00 3/4 20.00 25/32\nm19 2.50 16.50 21/32 17.50 11/16 20.00 25/32 21.00 53/64\nm20 2.00 18.00 45/64 18.50 47/64 21.00 53/64 22.00 55/64".split('\n').reduce(function (bolts, line, index) {
    var params = line.split(' ');
    var name = "".concat(params[0]);
    bolts[name] = {
      name: name,
      tap: parseFloat(params[2]),
      close: parseFloat(params[6]),
      loose: parseFloat(params[8])
    };
    return bolts;
  }, {});
  debug$2('ScrewTapSizes', ScrewTapSizes$1);
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

  var MetricHexBoltDimensions = "m10\t10.00\t9.78\t6.63\t6.17\t17.00\t15.73\t18.48\t17.77\nm12\t12.00\t11.73\t7.76\t4.24\t19.00\t17.73\t20.78\t20.03\nm14\t14.00\t13.73\t9.09\t8.51\t22.00\t20.67\t24.25\t23.35\nm16\t16.00\t15.73\t10.32\t9.68\t24.00\t23.67\t27.71\t26.75\nm20\t20.00\t19.67\t12.88\t12.12\t30.00\t29.16\t34.64\t32.95\nm24\t24.00\t23.67\t15.44\t14.56\t36.00\t35.00\t41.57\t39.55\nm30\t30.00\t29.67\t19.48\t17.92\t46.00\t45.00\t53.12\t50.85\nm36\t36.00\t35.61\t23.38\t21.63\t55.00\t53.80\t63.51\t60.79\nm42\t42.00\t41.38\t26.97\t25.03\t65.00\t62.90\t75.06\t71.71\nm48\t48.00\t47.38\t31.07\t28.93\t75.00\t72.60\t86.60\t82.76\nm56\t56.00\t55.26\t36.2\t33.80\t85.00\t82.20\t98.15\t93.71\nm64\t64.00\t63.26\t41.32\t38.68\t95.00\t91.80\t109.70\t104.65\nm72\t72.00\t71.26\t46.45\t43.55\t105.00\t101.40\t121.24\t115.60\nm80\t80.00\t79.26\t51.58\t48.42\t115.00\t111.00\t132.72\t126.54\nm90\t90.00\t89.13\t57.74\t54.26\t130.00\t125.50\t150.11\t143.07\nm100\t90.00\t99.13\t63.9\t60.10\t145.00\t140.00\t167.43\t159.60".split('\n').reduce(function (bolts, line) {
    var params = line.split('\t');
    var name = "".concat(params[0], " hex");
    var tap = ScrewTapSizes$1[params[0]] || {
      tap: parseFloat(params[1]),
      close: parseFloat(params[1]),
      loose: parseFloat(params[1])
    };
    bolts[name] = _objectSpread2({}, tap, {
      name: name,
      E: parseFloat(params[1]),
      F: parseFloat(params[5]),
      G: parseFloat(params[7]),
      H: parseFloat(params[3]),
      type: 'HexHeadScrew'
    });
    return bolts;
  }, {});
  debug$2('MetricHexBoltDimensions', MetricHexBoltDimensions);
  /**
   * @see https://www.fastenal.com/content/product_specifications/M.SHCS.4762.8.8.Z.pdf
   *
   * Nominal Size (d), Body Diameter Max, min, Head Diameter max, min, Head Height max, min, Socket Size max, min, Key Engagement min
   *
   * E - Body Diameter
   * H - Head Height
   * D - Head Diameter
   */

  var SocketCapScrewDimensions$1 = "m1.6 1.60 1.46 3.14 2.86 1.60 1.46 1.58 1.52 0.7\nm2 2.00 1.86 3.98 3.62 2.00 1.86 1.58 1.52 1\nm2.5 2.50 2.36 4.68 4.32 2.50 2.36 2.08 2.02 1.1\nm3 3.00 2.86 5.68 5.32 3.00 2.86 2.58 2.52 1.3\nm4 4.00 3.82 7.22 6.78 4.00 3.82 3.08 3.02 2\nm5 5.00 4.82 8.72 8.28 5.00 4.82 4.095 4.020 2.5\nm6 6.00 5.82 10.22 9.78 6.00 5.70 5.14 5.02 3\nm8 8.00 7.78 13.27 12.73 8.00 7.64 6.14 6.02 4\nm10 10.00 9.78 16.27 15.73 10.00 9.64 8.175 8.025 5\nm12 12.00 11.73 18.27 17.73 12.00 11.57 10.175 10.025 6\nm14 14.00 13.73 21.33 20.67 14.00 13.57 12.212 12.032 7\nm16 16.00 15.73 24.33 23.67 16.00 15.57 14.212 14.032 8\nm20 20.00 19.67 30.33 29.67 20.00 19.48 17.23 17.05 10\nm24 24.00 23.67 36.39 35.61 24.00 23.48 19.275 19.065 12\nm30 30.00 29.67 45.39 44.61 30.00 29.48 22.275 22.065 15.5\nm36 36.00 35.61 54.46 53.54 36.00 35.38 27.275 27.065 19\nm42 42.00 41.61 63.46 62.54 42.00 41.38 32.33 32.08 24".split('\n').reduce(function (screws, line, index) {
    var params = line.split(' ');
    var name = "".concat(params[0], " socket");
    var tap = ScrewTapSizes$1[params[0]] || {
      tap: parseFloat(params[1]),
      close: parseFloat(params[1]),
      loose: parseFloat(params[1])
    };
    screws[name] = _objectSpread2({}, tap, {
      name: name,
      E: parseFloat(params[1]),
      H: parseFloat(params[5]),
      D: parseFloat(params[3]),
      type: 'PanHeadScrew'
    });
    return screws;
  }, {});
  debug$2('SocketCapScrewDimensions', SocketCapScrewDimensions$1);
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

  var MetricBolts = _objectSpread2({}, MetricHexBoltDimensions, {}, SocketCapScrewDimensions$1); // headDiameter, headLength, diameter, tap, countersink

  var MetricScrews = {
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

  var MetricNuts = {
    m4: [7, 8.1, 3.2, 4]
  };
  /**
   * Metric washer sizes
   * Size	Inside Diameter	Outside Diameter	Thickness
   * @see https://armstrongmetalcrafts.com/Reference/WasherSizes.aspx
   * @type {Object}
   */

  var MetricWashers = "M1\t1.1mm\t3.2mm\t0.3mm\nM1.2\t1.3mm\t3.8mm\t0.3mm\nM1.4\t1.5mm\t3.8mm\t0.3mm\nM1.6\t1.7mm\t4.0mm\t0.3mm\nM2\t2.2mm\t5.0mm\t0.3mm\nM2.5\t2.7mm\t6.0mm\t0.5mm\nM3\t3.2mm\t7.0mm\t0.5mm\nM3.5\t3.7mm\t8.0mm\t0.5mm\nM4\t4.3mm\t9.0mm\t0.8mm\nM5\t5.3mm\t10mm\t1mm\nM6\t6.4mm\t12mm\t1.6mm\nM7\t7.4mm\t14mm\t1.6mm\nM8\t8.4mm\t16mm\t1.6mm\nM10\t10.5mm\t20mm\t2.0mm\nM11\t12mm\t24mm\t2.5mm\nM12\t13mm\t24mm\t2.5mm\nM14\t15mm\t28mm\t2.5mm\nM16\t17mm\t30mm\t3.0mm\nM18\t19mm\t34mm\t3.0mm\nM20\t21mm\t37mm\t3.0mm".split('\n').reduce(function ParseWasher(washers, line) {
    var _line$replace$split$m = line.replace(/mm/g, '').split('\t').map(function parseValues(field, index) {
      return index == 0 ? field : parseFloat(field);
    }),
        _line$replace$split$m2 = _slicedToArray(_line$replace$split$m, 4),
        size = _line$replace$split$m2[0],
        id = _line$replace$split$m2[1],
        od = _line$replace$split$m2[2],
        thickness = _line$replace$split$m2[3];

    washers[size] = {
      size: size,
      id: id,
      od: od,
      thickness: thickness
    };
    return washers;
  }, {});

  var metric = /*#__PURE__*/Object.freeze({
    MetricBolts: MetricBolts,
    MetricScrews: MetricScrews,
    MetricNuts: MetricNuts,
    MetricWashers: MetricWashers
  });

  exports.hardware = hardware;
  exports.imperial = imperial;
  exports.metric = metric;

  return exports;

}({}, jsCadCSG, jscadUtils));
/* jscad-hardware follow me on Twitter! @johnwebbcole */

  // end:compat

  debug('jscadHardware', jscadHardware);
  Hardware = jscadHardware.hardware;

  ImperialBolts = jscadHardware.imperial.ImperialBolts;
  ImperialNuts = jscadHardware.imperial.ImperialNuts;
  ImperialWashers = jscadHardware.imperial.ImperialWashers;
  ImperialWoodScrews = jscadHardware.imperial.ImperialWoodScrews;

  MetricBolts = jscadHardware.metric.MetricBolts;
  MetricNuts = jscadHardware.metric.MetricNuts;
  MetricWashers = jscadHardware.metric.MetricWashers;
  MetricWoodScrews = jscadHardware.metric.MetricWoodScrews;
}

/**
 * Add `initJscadHardware` to the init queue for `util.init`.
 */
jscadUtilsPluginInit.push(initJscadHardware);
/* eslint-enable */

// endinject
