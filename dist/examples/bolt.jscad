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
// ../node_modules/@jwc/jscad-utils/dist/compat.js
var Parts, Boxes, Group, Debug;

function initJscadutils(_CSG, options = {}) {
    options = Object.assign({
        debug: ""
    }, options);
    var jsCadCSG = {
        CSG,
        CAG
    };
    var scadApi = {
        vector_text,
        rectangular_extrude,
        vector_char,
        primitives3d: {
            cube,
            sphere,
            cylinder
        },
        extrusions: {
            rectangular_extrude
        },
        text: {
            vector_text,
            vector_char
        },
        booleanOps: {
            union
        }
    };
    var jscadUtilsDebug = (options.debug.split(",") || []).reduce((checks, check) => {
        if (check.startsWith("-")) {
            checks.disabled.push(new RegExp(`^${check.slice(1).replace(/\*/g, ".*?")}$`));
        } else {
            checks.enabled.push(new RegExp(`^${check.replace(/\*/g, ".*?")}$`));
        }
        return checks;
    }, {
        enabled: [],
        disabled: []
    });
    var jscadUtils = function(exports, jsCadCSG, scadApi) {
        "use strict";
        jsCadCSG = jsCadCSG && jsCadCSG.hasOwnProperty("default") ? jsCadCSG["default"] : jsCadCSG;
        scadApi = scadApi && scadApi.hasOwnProperty("default") ? scadApi["default"] : scadApi;
        function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value,
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
                if (enumerableOnly) symbols = symbols.filter(function(sym) {
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
                    ownKeys(source, true).forEach(function(key) {
                        _defineProperty(target, key, source[key]);
                    });
                } else if (Object.getOwnPropertyDescriptors) {
                    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
                } else {
                    ownKeys(source).forEach(function(key) {
                        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                    });
                }
            }
            return target;
        }
        var toRadians = function toRadians(deg) {
            return deg / 180 * Math.PI;
        };
        var toDegrees = function toDegrees(rad) {
            return rad * (180 / Math.PI);
        };
        var solve = function solve(p1, p2) {
            var r = {
                c: 90,
                A: Math.abs(p2.x - p1.x),
                B: Math.abs(p2.y - p1.y)
            };
            var brad = Math.atan2(r.B, r.A);
            r.b = this.toDegrees(brad);
            r.C = r.B / Math.sin(brad);
            r.a = 90 - r.b;
            return r;
        };
        var solve90SA = function solve90SA(r) {
            r = Object.assign(r, {
                C: 90
            });
            r.A = r.A || 90 - r.B;
            r.B = r.B || 90 - r.A;
            var arad = toRadians(r.A);
            r.a = r.a || (r.c ? r.c * Math.sin(arad) : r.b * Math.tan(arad));
            r.c = r.c || r.a / Math.sin(arad);
            r.b = r.b || r.a / Math.tan(arad);
            return r;
        };
        var solve90ac = function solve90ac(r) {
            r = Object.assign(r, {
                C: 90
            });
            var arad = Math.asin(r.a / r.c);
            r.A = toDegrees(arad);
            r.B = 90 - r.A;
            r.b = Math.sqrt(Math.pow(r.c, 2) - Math.pow(r.a, 2));
            return r;
        };
        var triangle = Object.freeze({
            toRadians,
            toDegrees,
            solve,
            solve90SA,
            solve90ac
        });
        var div = function div(a, f) {
            return a.map(function(e) {
                return e / f;
            });
        };
        var addValue = function addValue(a, f) {
            return a.map(function(e) {
                return e + f;
            });
        };
        var addArray = function addArray(a, f) {
            return a.map(function(e, i) {
                return e + f[i];
            });
        };
        var add = function add(a) {
            return Array.prototype.slice.call(arguments, 1).reduce(function(result, arg) {
                if (Array.isArray(arg)) {
                    result = addArray(result, arg);
                } else {
                    result = addValue(result, arg);
                }
                return result;
            }, a);
        };
        var fromxyz = function fromxyz(object) {
            return Array.isArray(object) ? object : [ object.x, object.y, object.z ];
        };
        var toxyz = function toxyz(a) {
            return {
                x: a[0],
                y: a[1],
                z: a[2]
            };
        };
        var first = function first(a) {
            return a ? a[0] : undefined;
        };
        var last = function last(a) {
            return a && a.length > 0 ? a[a.length - 1] : undefined;
        };
        var min = function min(a) {
            return a.reduce(function(result, value) {
                return value < result ? value : result;
            }, Number.MAX_VALUE);
        };
        var range = function range(a, b) {
            var result = [];
            for (var i = a; i < b; i++) {
                result.push(i);
            }
            return result;
        };
        var array = Object.freeze({
            div,
            addValue,
            addArray,
            add,
            fromxyz,
            toxyz,
            first,
            last,
            min,
            range
        });
        var debugColors = [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999" ];
        var debugCount = 0;
        var Debug = function Debug(name) {
            var style = "color:".concat(debugColors[debugCount++ % debugColors.length]);
            var checks = jscadUtilsDebug || {
                enabled: [],
                disabled: []
            };
            var enabled = checks.enabled.some(function checkEnabled(check) {
                return check.test(name);
            }) && !checks.disabled.some(function checkEnabled(check) {
                return check.test(name);
            });
            return enabled ? function() {
                var _console;
                for (var _len = arguments.length, msg = new Array(_len), _key = 0; _key < _len; _key++) {
                    msg[_key] = arguments[_key];
                }
                (_console = console).log.apply(_console, [ "%c%s", style, name ].concat(msg));
            } : function() {
                return undefined;
            };
        };
        var debug = Debug("jscadUtils:group");
        function group() {
            var names = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var parts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.name = "";
            this.names = names;
            this.parts = parts;
        }
        group.prototype.add = function(object, name, hidden, subparts, parts) {
            var self = this;
            if (object.parts) {
                if (name) {
                    if (!hidden) self.names.push(name);
                    self.parts[name] = object.combine(parts);
                    if (subparts) {
                        Object.keys(object.parts).forEach(function(key) {
                            self.parts[subparts + key] = object.parts[key];
                        });
                    }
                } else {
                    Object.assign(self.parts, object.parts);
                    self.names = self.names.concat(object.names);
                }
            } else {
                if (!hidden) self.names.push(name);
                self.parts[name] = object;
            }
            return self;
        };
        group.prototype.combine = function(pieces, options, map) {
            var self = this;
            options = Object.assign({
                noholes: false
            }, options);
            pieces = pieces ? pieces.split(",") : self.names;
            if (pieces.length === 0) {
                throw new Error("no pieces found in ".concat(self.name, " pieces: ").concat(pieces, " parts: ").concat(Object.keys(self.parts), " names: ").concat(self.names));
            }
            var g = union(mapPick(self.parts, pieces, function(value, key, object) {
                return map ? map(value, key, object) : identity(value);
            }, self.name));
            return g.subtractIf(self.holes && Array.isArray(self.holes) ? union(self.holes) : self.holes, self.holes && !options.noholes);
        };
        group.prototype.map = function(cb) {
            var self = this;
            self.parts = Object.keys(self.parts).filter(function(k) {
                return k !== "holes";
            }).reduce(function(result, key) {
                result[key] = cb(self.parts[key], key);
                return result;
            }, {});
            if (self.holes) {
                if (Array.isArray(self.holes)) {
                    self.holes = self.holes.map(function(hole, idx) {
                        return cb(hole, idx);
                    });
                } else {
                    self.holes = cb(self.holes, "holes");
                }
            }
            return self;
        };
        group.prototype.clone = function(map) {
            var self = this;
            if (!map) map = identity;
            var group = Group();
            Object.keys(self.parts).forEach(function(key) {
                var part = self.parts[key];
                var hidden = self.names.indexOf(key) == -1;
                group.add(map(CSG.fromPolygons(part.toPolygons())), key, hidden);
            });
            if (self.holes) {
                group.holes = toArray(self.holes).map(function(part) {
                    return map(CSG.fromPolygons(part.toPolygons()), "holes");
                });
            }
            return group;
        };
        group.prototype.rotate = function(solid, axis, angle) {
            var self = this;
            var axes = {
                x: [ 1, 0, 0 ],
                y: [ 0, 1, 0 ],
                z: [ 0, 0, 1 ]
            };
            if (typeof solid === "string") {
                var _names = solid;
                solid = self.combine(_names);
            }
            var rotationCenter = solid.centroid();
            var rotationAxis = axes[axis];
            self.map(function(part) {
                return part.rotate(rotationCenter, rotationAxis, angle);
            });
            return self;
        };
        group.prototype.combineAll = function(options, map) {
            var self = this;
            return self.combine(Object.keys(self.parts).join(","), options, map);
        };
        group.prototype.snap = function snap(part, to, axis, orientation, delta) {
            var self = this;
            var t = calcSnap(self.combine(part), to, axis, orientation, delta);
            self.map(function(part) {
                return part.translate(t);
            });
            return self;
        };
        group.prototype.align = function align(part, to, axis, delta) {
            var self = this;
            var t = calcCenterWith(self.combine(part, {
                noholes: true
            }), axis, to, delta);
            self.map(function(part) {
                return part.translate(t);
            });
            return self;
        };
        group.prototype.midlineTo = function midlineTo(part, axis, to) {
            var self = this;
            var size = self.combine(part).size();
            var t = axisApply(axis, function(i, a) {
                return to - size[a] / 2;
            });
            self.map(function(part) {
                return part.translate(t);
            });
            return self;
        };
        group.prototype.translate = function translate(x, y, z) {
            var self = this;
            var t = Array.isArray(x) ? x : [ x, y, z ];
            debug("translate", t);
            self.map(function(part) {
                return part.translate(t);
            });
            return self;
        };
        group.prototype.pick = function(parts, map) {
            var self = this;
            var p = parts && parts.length > 0 && parts.split(",") || self.names;
            if (!map) map = identity;
            var g = Group();
            p.forEach(function(name) {
                g.add(map(CSG.fromPolygons(self.parts[name].toPolygons()), name), name);
            });
            return g;
        };
        group.prototype.array = function(parts, map) {
            var self = this;
            var p = parts && parts.length > 0 && parts.split(",") || self.names;
            if (!map) map = identity;
            var a = [];
            p.forEach(function(name) {
                a.push(map(CSG.fromPolygons(self.parts[name].toPolygons()), name));
            });
            return a;
        };
        group.prototype.toArray = function(pieces) {
            var self = this;
            pieces = pieces ? pieces.split(",") : self.names;
            return pieces.map(function(piece) {
                if (!self.parts[piece]) console.error("Cannot find ".concat(piece, " in ").concat(self.names));
                return self.parts[piece];
            });
        };
        var Group = function Group() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }
            debug.apply(void 0, [ "Group" ].concat(args));
            var self = {
                name: "",
                names: [],
                parts: {}
            };
            if (args && args.length > 0) {
                if (args.length === 2) {
                    var names = args[0], objects = args[1];
                    self.names = names && names.length > 0 && names.split(",") || [];
                    if (Array.isArray(objects)) {
                        self.parts = zipObject(self.names, objects);
                    } else if (objects instanceof CSG) {
                        self.parts = zipObject(self.names, [ objects ]);
                    } else {
                        self.parts = objects || {};
                    }
                } else {
                    var objects = args[0];
                    self.names = Object.keys(objects).filter(function(k) {
                        return k !== "holes";
                    });
                    self.parts = Object.assign({}, objects);
                    self.holes = objects.holes;
                }
            }
            return new group(self.names, self.parts);
        };
        var debug$1 = Debug("jscadUtils:util");
        var CSG$1 = jsCadCSG.CSG;
        var rectangular_extrude = scadApi.extrusions.rectangular_extrude;
        var _scadApi$text = scadApi.text, vector_text = _scadApi$text.vector_text, vector_char = _scadApi$text.vector_char;
        var union$1 = scadApi.booleanOps.union;
        var NOZZEL_SIZE = .4;
        var nearest = {
            under: function under(desired) {
                var nozzel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NOZZEL_SIZE;
                var nozzie = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                return (Math.floor(desired / nozzel) + nozzie) * nozzel;
            },
            over: function over(desired) {
                var nozzel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NOZZEL_SIZE;
                var nozzie = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                return (Math.ceil(desired / nozzel) + nozzie) * nozzel;
            }
        };
        var identity = function identity(solid) {
            return solid;
        };
        var result = function result(object, f) {
            if (typeof f === "function") {
                return f.call(object);
            } else {
                return f;
            }
        };
        var defaults = function defaults(target, _defaults) {
            depreciated("defaults", true, "use Object.assign instead");
            return Object.assign(_defaults, target);
        };
        var isEmpty = function isEmpty(variable) {
            return typeof variable === "undefined" || variable === null;
        };
        var isNegative = function isNegative(n) {
            return ((n = +n) || 1 / n) < 0;
        };
        var print = function print(msg, o) {
            debug$1(msg, JSON.stringify(o.getBounds()), JSON.stringify(this.size(o.getBounds())));
        };
        var error = function error(msg) {
            if (console && console.error) console.error(msg);
            throw new Error(msg);
        };
        var depreciated = function depreciated(method, error, message) {
            var msg = method + " is depreciated." + (" " + message || "");
            if (!error && console && console.error) console[error ? "error" : "warn"](msg);
            if (error) throw new Error(msg);
        };
        function inch(x) {
            return x * 25.4;
        }
        function cm(x) {
            return x / 25.4;
        }
        function label(text, x, y, width, height) {
            var l = vector_text(x || 0, y || 0, text);
            var o = [];
            l.forEach(function(pl) {
                o.push(rectangular_extrude(pl, {
                    w: width || 2,
                    h: height || 2
                }));
            });
            var foo = union$1(o);
            return center(union$1(o));
        }
        function text(text) {
            var l = vector_char(0, 0, text);
            var _char = l.segments.reduce(function(result, segment) {
                var path = new CSG$1.Path2D(segment);
                var cag = path.expandToCAG(2);
                return result ? result.union(cag) : cag;
            }, undefined);
            return _char;
        }
        var unitCube = function unitCube(length, radius) {
            radius = radius || .5;
            return CSG$1.cube({
                center: [ 0, 0, 0 ],
                radius: [ radius, radius, length || .5 ]
            });
        };
        var unitAxis = function unitAxis(length, radius, centroid) {
            centroid = centroid || [ 0, 0, 0 ];
            return unitCube(length, radius).union([ unitCube(length, radius).rotateY(90).setColor(0, 1, 0), unitCube(length, radius).rotateX(90).setColor(0, 0, 1) ]).translate(centroid);
        };
        var toArray = function toArray(a) {
            return Array.isArray(a) ? a : [ a ];
        };
        var ifArray = function ifArray(a, cb) {
            return Array.isArray(a) ? a.map(cb) : cb(a);
        };
        var segment = function segment(object, segments, axis) {
            var size = object.size()[axis];
            var width = size / segments;
            var result = [];
            for (var i = width; i < size; i += width) {
                result.push(i);
            }
            return result;
        };
        var zipObject = function zipObject(names, values) {
            return names.reduce(function(result, value, idx) {
                result[value] = values[idx];
                return result;
            }, {});
        };
        var map = function map(o, f) {
            return Object.keys(o).map(function(key) {
                return f(o[key], key, o);
            });
        };
        var mapValues = function mapValues(o, f) {
            return Object.keys(o).map(function(key) {
                return f(o[key], key);
            });
        };
        var pick = function pick(o, names) {
            return names.reduce(function(result, name) {
                result[name] = o[name];
                return result;
            }, {});
        };
        var mapPick = function mapPick(o, names, f, options) {
            return names.reduce(function(result, name) {
                if (!o[name]) {
                    throw new Error("".concat(name, " not found in ").concat(options.name, ": ").concat(Object.keys(o).join(",")));
                }
                result.push(f ? f(o[name]) : o[name]);
                return result;
            }, []);
        };
        var divA = function divA(a, f) {
            return div(a, f);
        };
        var divxyz = function divxyz(size, x, y, z) {
            return {
                x: size.x / x,
                y: size.y / y,
                z: size.z / z
            };
        };
        var div$1 = function div(size, d) {
            return this.divxyz(size, d, d, d);
        };
        var mulxyz = function mulxyz(size, x, y, z) {
            return {
                x: size.x * x,
                y: size.y * y,
                z: size.z * z
            };
        };
        var mul = function mul(size, d) {
            return this.divxyz(size, d, d, d);
        };
        var xyz2array = function xyz2array(size) {
            return [ size.x, size.y, size.z ];
        };
        var rotationAxes = {
            x: [ 1, 0, 0 ],
            y: [ 0, 1, 0 ],
            z: [ 0, 0, 1 ]
        };
        var size = function size(o) {
            var bbox = o.getBounds ? o.getBounds() : o;
            var foo = bbox[1].minus(bbox[0]);
            return foo;
        };
        var scale = function scale(size, value) {
            if (value == 0) return 1;
            return 1 + 100 / (size / value) / 100;
        };
        function center(object, objectSize) {
            objectSize = objectSize || size(object.getBounds());
            return centerY(centerX(object, objectSize), objectSize);
        }
        function centerY(object, objectSize) {
            objectSize = objectSize || size(object.getBounds());
            return object.translate([ 0, -objectSize.y / 2, 0 ]);
        }
        function centerX(object, objectSize) {
            objectSize = objectSize || size(object.getBounds());
            return object.translate([ -objectSize.x / 2, 0, 0 ]);
        }
        var enlarge = function enlarge(object, x, y, z) {
            var a;
            if (Array.isArray(x)) {
                a = x;
            } else {
                a = [ x, y, z ];
            }
            var size = util.size(object);
            var centroid = util.centroid(object, size);
            var idx = 0;
            var t = util.map(size, function(i) {
                return util.scale(i, a[idx++]);
            });
            var new_object = object.scale(t);
            var new_centroid = util.centroid(new_object);
            var delta = new_centroid.minus(centroid).times(-1);
            return new_object.translate(delta);
        };
        function fit(object, x, y, z, keep_aspect_ratio) {
            var a;
            if (Array.isArray(x)) {
                a = x;
                keep_aspect_ratio = y;
                x = a[0];
                y = a[1];
                z = a[2];
            } else {
                a = [ x, y, z ];
            }
            var objectSize = size(object.getBounds());
            function scale(size, value) {
                if (value == 0) return 1;
                return value / size;
            }
            var s = [ scale(objectSize.x, x), scale(objectSize.y, y), scale(objectSize.z, z) ];
            var min = util.array.min(s);
            return util.centerWith(object.scale(s.map(function(d, i) {
                if (a[i] === 0) return 1;
                return keep_aspect_ratio ? min : d;
            })), "xyz", object);
        }
        function shift(object, x, y, z) {
            var hsize = this.div(this.size(object.getBounds()), 2);
            return object.translate(this.xyz2array(this.mulxyz(hsize, x, y, z)));
        }
        function zero(object) {
            var bounds = object.getBounds();
            return object.translate([ 0, 0, -bounds[0].z ]);
        }
        function mirrored4(x) {
            return x.union([ x.mirroredY(90), x.mirroredX(90), x.mirroredY(90).mirroredX(90) ]);
        }
        var flushSide = {
            "above-outside": [ 1, 0 ],
            "above-inside": [ 1, 1 ],
            "below-outside": [ 0, 1 ],
            "below-inside": [ 0, 0 ],
            "outside+": [ 0, 1 ],
            "outside-": [ 1, 0 ],
            "inside+": [ 1, 1 ],
            "inside-": [ 0, 0 ],
            "center+": [ -1, 1 ],
            "center-": [ -1, 0 ]
        };
        function calcFlush(moveobj, withobj, axes, mside, wside) {
            util.depreciated("calcFlush", false, "Use util.calcSnap instead.");
            var side;
            if (mside === 0 || mside === 1) {
                side = [ wside !== undefined ? wside : mside, mside ];
            } else {
                side = util.flushSide[mside];
                if (!side) util.error("invalid side: " + mside);
            }
            var m = moveobj.getBounds();
            var w = withobj.getBounds();
            if (side[0] === -1) {
                w[-1] = util.array.toxyz(withobj.centroid());
            }
            return this.axisApply(axes, function(i, axis) {
                return w[side[0]][axis] - m[side[1]][axis];
            });
        }
        function calcSnap(moveobj, withobj, axes, orientation) {
            var delta = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
            var side = flushSide[orientation];
            if (!side) {
                var fix = {
                    "01": "outside+",
                    10: "outside-",
                    11: "inside+",
                    "00": "inside-",
                    "-11": "center+",
                    "-10": "center-"
                };
                util.error("util.calcSnap: invalid side: " + orientation + " should be " + fix["" + orientation + delta]);
            }
            var m = moveobj.getBounds();
            var w = withobj.getBounds();
            if (side[0] === -1) {
                w[-1] = withobj.centroid();
            }
            var t = axisApply(axes, function(i, axis) {
                return w[side[0]][axis] - m[side[1]][axis];
            });
            return delta ? axisApply(axes, function(i) {
                return t[i] + delta;
            }) : t;
        }
        function snap(moveobj, withobj, axis, orientation, delta) {
            debug$1("snap", moveobj, withobj, axis, orientation, delta);
            var t = calcSnap(moveobj, withobj, axis, orientation, delta);
            return moveobj.translate(t);
        }
        function flush(moveobj, withobj, axis, mside, wside) {
            return moveobj.translate(util.calcFlush(moveobj, withobj, axis, mside, wside));
        }
        var axisApply = function axisApply(axes, valfun, a) {
            debug$1("axisApply", axes, valfun, a);
            var retval = a || [ 0, 0, 0 ];
            var lookup = {
                x: 0,
                y: 1,
                z: 2
            };
            axes.split("").forEach(function(axis) {
                retval[lookup[axis]] = valfun(lookup[axis], axis);
            });
            return retval;
        };
        var axis2array = function axis2array(axes, valfun) {
            util.depreciated("axis2array");
            var a = [ 0, 0, 0 ];
            var lookup = {
                x: 0,
                y: 1,
                z: 2
            };
            axes.split("").forEach(function(axis) {
                var i = lookup[axis];
                a[i] = valfun(i, axis);
            });
            return a;
        };
        function centroid(o, objectSize) {
            var bounds = o.getBounds();
            objectSize = objectSize || size(bounds);
            return bounds[0].plus(objectSize.dividedBy(2));
        }
        function calcmidlineTo(o, axis, to) {
            var bounds = o.getBounds();
            var size = util.size(bounds);
            return util.axisApply(axis, function(i, a) {
                return to - size[a] / 2;
            });
        }
        function midlineTo(o, axis, to) {
            return o.translate(util.calcmidlineTo(o, axis, to));
        }
        function translator(o, axis, withObj) {
            var centroid = util.centroid(o);
            var withCentroid = util.centroid(withObj);
            var t = util.axisApply(axis, function(i) {
                return withCentroid[i] - centroid[i];
            });
            return t;
        }
        function calcCenterWith(o, axes, withObj, delta) {
            var objectCentroid = centroid(o);
            var withCentroid = centroid(withObj);
            var t = axisApply(axes, function(i, axis) {
                return withCentroid[axis] - objectCentroid[axis];
            });
            return delta ? add(t, delta) : t;
        }
        function centerWith(o, axis, withObj) {
            return o.translate(calcCenterWith(o, axis, withObj));
        }
        function getDelta(size, bounds, axis, offset, nonzero) {
            if (!util.isEmpty(offset) && nonzero) {
                if (Math.abs(offset) < 1e-4) {
                    offset = 1e-4 * (util.isNegative(offset) ? -1 : 1);
                }
            }
            var dist = util.isNegative(offset) ? offset = size[axis] + offset : offset;
            return util.axisApply(axis, function(i, a) {
                return bounds[0][a] + (util.isEmpty(dist) ? size[axis] / 2 : dist);
            });
        }
        function bisect(object, axis, offset, angle, rotateaxis, rotateoffset) {
            var options = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
            options = Object.assign(options, {
                addRotationCenter: false
            });
            angle = angle || 0;
            var info = util.normalVector(axis);
            var bounds = object.getBounds();
            var size = util.size(object);
            rotateaxis = rotateaxis || {
                x: "y",
                y: "x",
                z: "x"
            }[axis];
            var cutDelta = options.cutDelta || util.getDelta(size, bounds, axis, offset);
            var rotateOffsetAxis = {
                xy: "z",
                yz: "x",
                xz: "y"
            }[[ axis, rotateaxis ].sort().join("")];
            var centroid = object.centroid();
            var rotateDelta = util.getDelta(size, bounds, rotateOffsetAxis, rotateoffset);
            var rotationCenter = options.rotationCenter || new CSG$1.Vector3D(util.axisApply("xyz", function(i, a) {
                if (a == axis) return cutDelta[i];
                if (a == rotateOffsetAxis) return rotateDelta[i];
                return centroid[a];
            }));
            var rotationAxis = util.rotationAxes[rotateaxis];
            var cutplane = CSG$1.OrthoNormalBasis.GetCartesian(info.orthoNormalCartesian[0], info.orthoNormalCartesian[1]).translate(cutDelta).rotate(rotationCenter, rotationAxis, angle);
            var g = Group("negative,positive", [ object.cutByPlane(cutplane.plane).color("red"), object.cutByPlane(cutplane.plane.flipped()).color("blue") ]);
            if (options.addRotationCenter) g.add(util.unitAxis(size.length() + 10, .5, rotationCenter), "rotationCenter");
            return g;
        }
        function stretch(object, axis, distance, offset) {
            var normal = {
                x: [ 1, 0, 0 ],
                y: [ 0, 1, 0 ],
                z: [ 0, 0, 1 ]
            };
            var bounds = object.getBounds();
            var size = util.size(object);
            var cutDelta = util.getDelta(size, bounds, axis, offset, true);
            return object.stretchAtPlane(normal[axis], cutDelta, distance);
        }
        function poly2solid(top, bottom, height) {
            if (top.sides.length == 0) {
                return new CSG$1();
            }
            var offsetVector = CSG$1.Vector3D.Create(0, 0, height);
            var normalVector = CSG$1.Vector3D.Create(0, 1, 0);
            var polygons = [];
            polygons = polygons.concat(bottom._toPlanePolygons({
                translation: [ 0, 0, 0 ],
                normalVector,
                flipped: !(offsetVector.z < 0)
            }));
            polygons = polygons.concat(top._toPlanePolygons({
                translation: offsetVector,
                normalVector,
                flipped: offsetVector.z < 0
            }));
            var c1 = new CSG$1.Connector(offsetVector.times(0), [ 0, 0, offsetVector.z ], normalVector);
            var c2 = new CSG$1.Connector(offsetVector, [ 0, 0, offsetVector.z ], normalVector);
            polygons = polygons.concat(bottom._toWallPolygons({
                cag: top,
                toConnector1: c1,
                toConnector2: c2
            }));
            return CSG$1.fromPolygons(polygons);
        }
        function slices2poly(slices, options, axis) {
            var twistangle = options && parseFloat(options.twistangle) || 0;
            var twiststeps = options && parseInt(options.twiststeps) || CSG$1.defaultResolution3D;
            if (twistangle == 0 || twiststeps < 1) {
                twiststeps = 1;
            }
            var normalVector = options.si.normalVector;
            var polygons = [];
            var first = util.array.first(slices);
            var last = util.array.last(slices);
            var up = first.offset[axis] > last.offset[axis];
            polygons = polygons.concat(first.poly._toPlanePolygons({
                translation: first.offset,
                normalVector,
                flipped: !up
            }));
            var rotateAxis = "rotate" + axis.toUpperCase();
            polygons = polygons.concat(last.poly._toPlanePolygons({
                translation: last.offset,
                normalVector: normalVector[rotateAxis](twistangle),
                flipped: up
            }));
            var rotate = twistangle === 0 ? function rotateZero(v) {
                return v;
            } : function rotate(v, angle, percent) {
                return v[rotateAxis](angle * percent);
            };
            var connectorAxis = last.offset.minus(first.offset).abs();
            slices.forEach(function(slice, idx) {
                if (idx < slices.length - 1) {
                    var nextidx = idx + 1;
                    var top = !up ? slices[nextidx] : slice;
                    var bottom = up ? slices[nextidx] : slice;
                    var c1 = new CSG$1.Connector(bottom.offset, connectorAxis, rotate(normalVector, twistangle, idx / slices.length));
                    var c2 = new CSG$1.Connector(top.offset, connectorAxis, rotate(normalVector, twistangle, nextidx / slices.length));
                    polygons = polygons.concat(bottom.poly._toWallPolygons({
                        cag: top.poly,
                        toConnector1: c1,
                        toConnector2: c2
                    }));
                }
            });
            return CSG$1.fromPolygons(polygons);
        }
        function normalVector(axis) {
            var axisInfo = {
                z: {
                    orthoNormalCartesian: [ "X", "Y" ],
                    normalVector: CSG$1.Vector3D.Create(0, 1, 0)
                },
                x: {
                    orthoNormalCartesian: [ "Y", "Z" ],
                    normalVector: CSG$1.Vector3D.Create(0, 0, 1)
                },
                y: {
                    orthoNormalCartesian: [ "X", "Z" ],
                    normalVector: CSG$1.Vector3D.Create(0, 0, 1)
                }
            };
            if (!axisInfo[axis]) util.error("util.normalVector: invalid axis " + axis);
            return axisInfo[axis];
        }
        function sliceParams(orientation, radius, bounds) {
            var axis = orientation[0];
            var direction = orientation[1];
            var dirInfo = {
                "dir+": {
                    sizeIdx: 1,
                    sizeDir: -1,
                    moveDir: -1,
                    positive: true
                },
                "dir-": {
                    sizeIdx: 0,
                    sizeDir: 1,
                    moveDir: 0,
                    positive: false
                }
            };
            var info = dirInfo["dir" + direction];
            return Object.assign({
                axis,
                cutDelta: util.axisApply(axis, function(i, a) {
                    return bounds[info.sizeIdx][a] + Math.abs(radius) * info.sizeDir;
                }),
                moveDelta: util.axisApply(axis, function(i, a) {
                    return bounds[info.sizeIdx][a] + Math.abs(radius) * info.moveDir;
                })
            }, info, util.normalVector(axis));
        }
        function reShape(object, radius, orientation, options, slicer) {
            options = options || {};
            var b = object.getBounds();
            var ar = Math.abs(radius);
            var si = util.sliceParams(orientation, radius, b);
            if (si.axis !== "z") throw new Error('util.reShape error: CAG._toPlanePolytons only uses the "z" axis.  You must use the "z" axis for now.');
            var cutplane = CSG$1.OrthoNormalBasis.GetCartesian(si.orthoNormalCartesian[0], si.orthoNormalCartesian[1]).translate(si.cutDelta);
            var slice = object.sectionCut(cutplane);
            var first = util.axisApply(si.axis, function() {
                return si.positive ? 0 : ar;
            });
            var last = util.axisApply(si.axis, function() {
                return si.positive ? ar : 0;
            });
            var plane = si.positive ? cutplane.plane : cutplane.plane.flipped();
            var slices = slicer(first, last, slice);
            var delta = util.slices2poly(slices, Object.assign(options, {
                si
            }), si.axis).color(options.color);
            var remainder = object.cutByPlane(plane);
            return union$1([ options.unionOriginal ? object : remainder, delta.translate(si.moveDelta) ]);
        }
        function chamfer(object, radius, orientation, options) {
            return util.reShape(object, radius, orientation, options, function(first, last, slice) {
                return [ {
                    poly: slice,
                    offset: new CSG$1.Vector3D(first)
                }, {
                    poly: util.enlarge(slice, [ -radius * 2, -radius * 2 ]),
                    offset: new CSG$1.Vector3D(last)
                } ];
            });
        }
        function fillet(object, radius, orientation, options) {
            options = options || {};
            return util.reShape(object, radius, orientation, options, function(first, last, slice) {
                var v1 = new CSG$1.Vector3D(first);
                var v2 = new CSG$1.Vector3D(last);
                var res = options.resolution || CSG$1.defaultResolution3D;
                var slices = util.array.range(0, res).map(function(i) {
                    var p = i > 0 ? i / (res - 1) : 0;
                    var v = v1.lerp(v2, p);
                    var size = -radius * 2 - Math.cos(Math.asin(p)) * (-radius * 2);
                    return {
                        poly: util.enlarge(slice, [ size, size ]),
                        offset: v
                    };
                });
                return slices;
            });
        }
        function calcRotate(part, solid, axis) {
            var axes = {
                x: [ 1, 0, 0 ],
                y: [ 0, 1, 0 ],
                z: [ 0, 0, 1 ]
            };
            var rotationCenter = solid.centroid();
            var rotationAxis = axes[axis];
            return {
                rotationCenter,
                rotationAxis
            };
        }
        function rotateAround(part, solid, axis, angle) {
            var _util$calcRotate = util.calcRotate(part, solid, axis, angle), rotationCenter = _util$calcRotate.rotationCenter, rotationAxis = _util$calcRotate.rotationAxis;
            return part.rotate(rotationCenter, rotationAxis, angle);
        }
        var util$1 = Object.freeze({
            NOZZEL_SIZE,
            nearest,
            identity,
            result,
            defaults,
            isEmpty,
            isNegative,
            print,
            error,
            depreciated,
            inch,
            cm,
            label,
            text,
            unitCube,
            unitAxis,
            toArray,
            ifArray,
            segment,
            zipObject,
            map,
            mapValues,
            pick,
            mapPick,
            divA,
            divxyz,
            div: div$1,
            mulxyz,
            mul,
            xyz2array,
            rotationAxes,
            size,
            scale,
            center,
            centerY,
            centerX,
            enlarge,
            fit,
            shift,
            zero,
            mirrored4,
            flushSide,
            calcFlush,
            calcSnap,
            snap,
            flush,
            axisApply,
            axis2array,
            centroid,
            calcmidlineTo,
            midlineTo,
            translator,
            calcCenterWith,
            centerWith,
            getDelta,
            bisect,
            stretch,
            poly2solid,
            slices2poly,
            normalVector,
            sliceParams,
            reShape,
            chamfer,
            fillet,
            calcRotate,
            rotateAround
        });
        var nameArray = {
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgrey: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkslategrey: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dimgrey: "#696969",
            dodgerblue: "#1e90ff",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#dcdcdc",
            ghostwhite: "#f8f8ff",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gray: "#808080",
            grey: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgray: "#d3d3d3",
            lightgrey: "#d3d3d3",
            lightgreen: "#90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslategray: "#778899",
            lightslategrey: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32cd32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370d8",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdf5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#d87093",
            papayawhip: "#ffefd5",
            peachpuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            skyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            slategrey: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32"
        };
        function name2hex(n) {
            n = n.toLowerCase();
            if (!nameArray[n]) return "Invalid Color Name";
            return nameArray[n];
        }
        function hex2rgb(h) {
            h = h.replace(/^\#/, "");
            if (h.length === 6) {
                return [ parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16) ];
            }
        }
        var _name2rgb = {};
        function name2rgb(n) {
            if (!_name2rgb[n]) _name2rgb[n] = hex2rgb(name2hex(n));
            return _name2rgb[n];
        }
        function color(o, r, g, b, a) {
            if (typeof r !== "string") return o.setColor(r, g, b, a);
            if (r === "") return o;
            var c = name2rgb(r).map(function(x) {
                return x / 255;
            });
            c[3] = g || 1;
            return o.setColor(c);
        }
        function init(proto) {
            if (proto.prototype._jscadutilsinit) return;
            proto.prototype.color = function(r, g, b, a) {
                if (!r) return this;
                return color(this, r, g, b, a);
            };
            proto.prototype.flush = function flush$1(to, axis, mside, wside) {
                return flush(this, to, axis, mside, wside);
            };
            proto.prototype.snap = function snap$1(to, axis, orientation, delta) {
                return snap(this, to, axis, orientation, delta);
            };
            proto.prototype.calcSnap = function calcSnap$1(to, axis, orientation, delta) {
                return calcSnap(this, to, axis, orientation, delta);
            };
            proto.prototype.midlineTo = function midlineTo$1(axis, to) {
                return midlineTo(this, axis, to);
            };
            proto.prototype.calcmidlineTo = function midlineTo(axis, to) {
                return calcmidlineTo(this, axis, to);
            };
            proto.prototype.centerWith = function centerWith$1(axis, to) {
                depreciated("centerWith", true, "Use align instead.");
                return centerWith(this, axis, to);
            };
            if (proto.center) echo("proto already has .center");
            proto.prototype.center = function center(axis) {
                return centerWith(this, axis || "xyz", unitCube());
            };
            proto.prototype.calcCenter = function centerWith(axis) {
                return calcCenterWith(this, axis || "xyz", unitCube(), 0);
            };
            proto.prototype.align = function align(to, axis) {
                return centerWith(this, axis, to);
            };
            proto.prototype.calcAlign = function calcAlign(to, axis, delta) {
                return calcCenterWith(this, axis, to, delta);
            };
            proto.prototype.enlarge = function enlarge$1(x, y, z) {
                return enlarge(this, x, y, z);
            };
            proto.prototype.fit = function fit$1(x, y, z, a) {
                return fit(this, x, y, z, a);
            };
            if (proto.size) echo("proto already has .size");
            proto.prototype.size = function() {
                return size(this.getBounds());
            };
            proto.prototype.centroid = function() {
                return centroid(this);
            };
            proto.prototype.Zero = function zero$1() {
                return zero(this);
            };
            proto.prototype.Center = function Center(axes) {
                return this.align(unitCube(), axes || "xy");
            };
            proto.Vector2D.prototype.map = function Vector2D_map(cb) {
                return new proto.Vector2D(cb(this.x), cb(this.y));
            };
            proto.prototype.fillet = function fillet$1(radius, orientation, options) {
                return fillet(this, radius, orientation, options);
            };
            proto.prototype.chamfer = function chamfer$1(radius, orientation, options) {
                return chamfer(this, radius, orientation, options);
            };
            proto.prototype.bisect = function bisect$1(axis, offset, angle, rotateaxis, rotateoffset, options) {
                return bisect(this, axis, offset, angle, rotateaxis, rotateoffset, options);
            };
            proto.prototype.stretch = function stretch$1(axis, distance, offset) {
                return stretch(this, axis, distance, offset);
            };
            proto.prototype.unionIf = function unionIf(object, condition) {
                return condition ? this.union(result(this, object)) : this;
            };
            proto.prototype.subtractIf = function subtractIf(object, condition) {
                return condition ? this.subtract(result(this, object)) : this;
            };
            proto.prototype._translate = proto.prototype.translate;
            proto.prototype.translate = function translate() {
                if (arguments.length === 1) {
                    return this._translate(arguments[0]);
                } else {
                    var t = Array.prototype.slice.call(arguments, 0).reduce(function(result, arg) {
                        result = undefined(result, arg);
                        return result;
                    }, [ 0, 0, 0 ]);
                    return this._translate(t);
                }
            };
            proto.prototype._jscadutilsinit = true;
        }
        var init$1 = Object.freeze({
            default: init
        });
        var CSG$2 = jsCadCSG.CSG, CAG = jsCadCSG.CAG;
        var debug$2 = Debug("jscadUtils:parts");
        var parts = {
            BBox,
            Cube,
            RoundedCube,
            Cylinder,
            Cone
        };
        function BBox() {
            var box = function box(object) {
                return CSG$2.cube({
                    center: object.centroid(),
                    radius: object.size().dividedBy(2)
                });
            };
            for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
                objects[_key] = arguments[_key];
            }
            return objects.reduce(function(bbox, part) {
                var object = bbox ? union([ bbox, box(part) ]) : part;
                return box(object);
            });
        }
        function Cube(width) {
            var r = div(fromxyz(width), 2);
            return CSG$2.cube({
                center: r,
                radius: r
            });
        }
        function RoundedCube(x, y, thickness, corner_radius) {
            if (x.getBounds) {
                var size$1 = size(x.getBounds());
                var r = [ size$1.x / 2, size$1.y / 2 ];
                thickness = size$1.z;
                corner_radius = y;
            } else {
                var r = [ x / 2, y / 2 ];
            }
            debug$2("RoundedCube", size$1, r, thickness, corner_radius);
            var roundedcube = CAG.roundedRectangle({
                center: [ r[0], r[1], 0 ],
                radius: r,
                roundradius: corner_radius
            }).extrude({
                offset: [ 0, 0, thickness || 1.62 ]
            });
            return roundedcube;
        }
        function Cylinder(diameter, height, options) {
            debug$2("parts.Cylinder", diameter, height, options);
            options = _objectSpread2({}, options, {
                start: [ 0, 0, 0 ],
                end: [ 0, 0, height ],
                radius: diameter / 2
            });
            return CSG$2.cylinder(options);
        }
        function Cone(diameter1, diameter2, height) {
            return CSG$2.cylinder({
                start: [ 0, 0, 0 ],
                end: [ 0, 0, height ],
                radiusStart: diameter1 / 2,
                radiusEnd: diameter2 / 2
            });
        }
        function Hexagon(diameter, height) {
            debug$2("hexagon", diameter, height);
            var radius = diameter / 2;
            var sqrt3 = Math.sqrt(3) / 2;
            var hex = CAG.fromPoints([ [ radius, 0 ], [ radius / 2, radius * sqrt3 ], [ -radius / 2, radius * sqrt3 ], [ -radius, 0 ], [ -radius / 2, -radius * sqrt3 ], [ radius / 2, -radius * sqrt3 ] ]);
            return hex.extrude({
                offset: [ 0, 0, height ]
            });
        }
        function Triangle(base, height) {
            var radius = base / 2;
            var tri = CAG.fromPoints([ [ -radius, 0 ], [ radius, 0 ], [ 0, Math.sin(30) * radius ] ]);
            return tri.extrude({
                offset: [ 0, 0, height ]
            });
        }
        function Tube(outsideDiameter, insideDiameter, height, outsideOptions, insideOptions) {
            return Cylinder(outsideDiameter, height, outsideOptions).subtract(Cylinder(insideDiameter, height, insideOptions || outsideOptions));
        }
        function Anchor() {
            var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
            var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
            var hole = Cylinder(width, height).Center().color("red");
            var post = Cylinder(height / 2, width * .66).rotateX(90).align(hole, "xz").snap(hole, "y", "inside-").translate([ 0, 0, -height / 6 ]).color("purple");
            return Group({
                post,
                hole
            });
        }
        function Board(width, height, corner_radius, thickness) {
            var r = divA([ width, height ], 2);
            var board = CAG.roundedRectangle({
                center: [ r[0], r[1], 0 ],
                radius: r,
                roundradius: corner_radius
            }).extrude({
                offset: [ 0, 0, thickness || 1.62 ]
            });
            return board;
        }
        var Hardware = {
            Orientation: {
                up: {
                    head: "outside-",
                    clear: "inside+"
                },
                down: {
                    head: "outside+",
                    clear: "inside-"
                }
            },
            Screw: function Screw(head, thread, headClearSpace, options) {
                options = Object.assign(options, {
                    orientation: "up",
                    clearance: [ 0, 0, 0 ]
                });
                var orientation = Hardware.Orientation[options.orientation];
                var group = Group("head,thread", {
                    head: head.color("gray"),
                    thread: thread.snap(head, "z", orientation.head).color("silver")
                });
                if (headClearSpace) {
                    group.add(headClearSpace.enlarge(options.clearance).snap(head, "z", orientation.clear).color("red"), "headClearSpace", true);
                }
                return group;
            },
            PanHeadScrew: function PanHeadScrew(headDiameter, headLength, diameter, length, clearLength, options) {
                var head = Cylinder(headDiameter, headLength);
                var thread = Cylinder(diameter, length);
                if (clearLength) {
                    var headClearSpace = Cylinder(headDiameter, clearLength);
                }
                return Hardware.Screw(head, thread, headClearSpace, options);
            },
            HexHeadScrew: function HexHeadScrew(headDiameter, headLength, diameter, length, clearLength, options) {
                var head = Hexagon(headDiameter, headLength);
                var thread = Cylinder(diameter, length);
                if (clearLength) {
                    var headClearSpace = Hexagon(headDiameter, clearLength);
                }
                return Hardware.Screw(head, thread, headClearSpace, options);
            },
            FlatHeadScrew: function FlatHeadScrew(headDiameter, headLength, diameter, length, clearLength, options) {
                var head = Cone(headDiameter, diameter, headLength);
                var thread = Cylinder(diameter, length);
                if (clearLength) {
                    var headClearSpace = Cylinder(headDiameter, clearLength);
                }
                return Hardware.Screw(head, thread, headClearSpace, options);
            }
        };
        var parts$1 = Object.freeze({
            default: parts,
            BBox,
            Cube,
            RoundedCube,
            Cylinder,
            Cone,
            Hexagon,
            Triangle,
            Tube,
            Anchor,
            Board,
            Hardware
        });
        var debug$3 = Debug("jscadUtils:boxes");
        var RabbetJoin = function RabbetJoin(box, thickness, cutHeight, rabbetHeight, cheekGap) {
            return rabbetJoin(box, thickness, cutHeight, rabbetHeight, cheekGap);
        };
        function topMiddleBottom(box, thickness) {
            debug$3("TopMiddleBottom", box, thickness);
            var bottom = box.bisect("z", thickness);
            var top = bottom.parts.positive.bisect("z", -thickness);
            return util.group("top,middle,bottom", [ top.parts.positive, top.parts.negative.color("green"), bottom.parts.negative ]);
        }
        function Rabett(box, thickness, gap, height, face) {
            debug$3("Rabett", box, thickness, gap, height, face);
            gap = gap || .25;
            var inside = -thickness - gap;
            var outside = -thickness + gap;
            var group = util.group();
            var top = box.bisect("z", height);
            var bottom = top.parts.negative.bisect("z", height - face);
            group.add(union([ top.parts.positive, bottom.parts.positive.subtract(bottom.parts.positive.enlarge(outside, outside, 0)).color("green") ]), "top");
            group.add(union([ bottom.parts.negative, bottom.parts.positive.intersect(bottom.parts.positive.enlarge(inside, inside, 0)).color("yellow") ]), "bottom");
            return group;
        }
        var RabettTopBottom = function rabbetTMB(box, thickness, gap) {
            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            options = Object.assign(options, {
                removableTop: true,
                removableBottom: true,
                topWidth: -thickness,
                bottomWidth: thickness
            });
            debug$3("RabettTopBottom", box, thickness, gap, options);
            gap = gap || .25;
            var group = util.group("", {
                box
            });
            var inside = -thickness - gap;
            var outside = -thickness + gap;
            if (options.removableTop) {
                var top = box.bisect("z", options.topWidth);
                group.add(top.parts.positive.enlarge([ inside, inside, 0 ]), "top");
                if (!options.removableBottom) group.add(box.subtract(top.parts.positive.enlarge([ outside, outside, 0 ])), "bottom");
            }
            if (options.removableBottom) {
                var bottom = box.bisect("z", options.bottomWidth);
                group.add(bottom.parts.negative.enlarge([ outside, outside, 0 ]), "bottomCutout", true);
                group.add(bottom.parts.negative.enlarge([ inside, inside, 0 ]), "bottom");
                if (!options.removableTop) group.add(box.subtract(group.parts.bottomCutout), "top");
            }
            if (options.removableBottom && options.removableTop) {
                group.add(box.subtract(union([ bottom.parts.negative.enlarge([ outside, outside, 0 ]), top.parts.positive.enlarge([ outside, outside, 0 ]) ])), "middle");
            }
            return group;
        };
        var CutOut = function cutOut(o, h, box, plug, gap) {
            gap = gap || .25;
            var s = o.size();
            var cutout = o.intersect(box);
            var cs = o.size();
            var clear = Parts.Cube([ s.x, s.y, h ]).align(o, "xy").color("yellow");
            var top = clear.snap(o, "z", "center+").union(o);
            var back = Parts.Cube([ cs.x + 6, 2, cs.z + 2.5 ]).align(cutout, "x").snap(cutout, "z", "center+").snap(cutout, "y", "outside-");
            var clip = Parts.Cube([ cs.x + 2 - gap, 1 - gap, cs.z + 2.5 ]).align(cutout, "x").snap(cutout, "z", "center+").snap(cutout, "y", "outside-");
            return util.group("insert", {
                top,
                bottom: clear.snap(o, "z", "center-").union(o),
                cutout: union([ o, top ]),
                back: back.subtract(plug).subtract(clip.enlarge(gap, gap, gap)).subtract(clear.translate([ 0, 5, 0 ])),
                clip: clip.subtract(plug).color("red"),
                insert: union([ o, top ]).intersect(box).subtract(o).enlarge([ -gap, 0, 0 ]).union(clip.subtract(plug).enlarge(-gap, -gap, 0)).color("blue")
            });
        };
        var Rectangle = function Rectangle(size, thickness, cb) {
            thickness = thickness || 2;
            var s = util.array.div(util.xyz2array(size), 2);
            var r = util.array.add(s, thickness);
            var box = CSG.cube({
                center: r,
                radius: r
            }).subtract(CSG.cube({
                center: r,
                radius: s
            }));
            if (cb) box = cb(box);
            return box;
        };
        var Hollow = function Hollow(object, thickness, interiorcb, exteriorcb) {
            thickness = thickness || 2;
            var size = -thickness * 2;
            interiorcb = interiorcb || util.identity;
            var box = object.subtract(interiorcb(object.enlarge([ size, size, size ])));
            if (exteriorcb) box = exteriorcb(box);
            return box;
        };
        var BBox$1 = function BBox(o) {
            var s = util.array.div(util.xyz2array(o.size()), 2);
            return CSG.cube({
                center: s,
                radius: s
            }).align(o, "xyz");
        };
        function getRadius(o) {
            return util.array.div(util.xyz2array(o.size()), 2);
        }
        function rabbetJoin(box, thickness, gap) {
            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            options = Object.assign(options, {
                removableTop: true,
                removableBottom: true
            });
            gap = gap || .25;
            var r = util.array.add(getRadius(box), -thickness / 2);
            r[2] = thickness / 2;
            var cutter = CSG.cube({
                center: r,
                radius: r
            }).align(box, "xy").color("green");
            var topCutter = cutter.snap(box, "z", "inside+");
            var group = util.group("", {
                topCutter,
                bottomCutter: cutter
            });
            group.add(box.subtract(cutter.enlarge([ gap, gap, 0 ])).color("blue"), "top");
            group.add(box.subtract(topCutter.enlarge([ gap, gap, 0 ])).color("red"), "bottom");
            return group;
        }
        var Boxes = Object.freeze({
            RabbetJoin,
            topMiddleBottom,
            Rabett,
            RabettTopBottom,
            CutOut,
            Rectangle,
            Hollow,
            BBox: BBox$1
        });
        var compatV1 = _objectSpread2({}, util$1, {
            group: Group,
            init: init$1,
            triangle,
            array,
            parts: parts$1,
            Boxes,
            Debug
        });
        exports.Boxes = Boxes;
        exports.Debug = Debug;
        exports.Group = Group;
        exports.array = array;
        exports.compatV1 = compatV1;
        exports.init = init$1;
        exports.parts = parts$1;
        exports.triangle = triangle;
        exports.util = util$1;
        return exports;
    }({}, jsCadCSG, scadApi);
    const debug = jscadUtils.Debug("jscadUtils:initJscadutils");
    util = jscadUtils.compatV1;
    util.init.default(CSG);
    debug("initJscadutils:jscadUtils", jscadUtils);
    Parts = jscadUtils.parts;
    Boxes = jscadUtils.Boxes;
    Group = jscadUtils.Group;
    Debug = jscadUtils.Debug;
    return jscadUtils;
}

var jscadUtilsPluginInit = [];

util = {
    init: (...a) => {
        initJscadutils(...a);
        jscadUtilsPluginInit.forEach(p => {
            p(...a);
        });
    }
};
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
 * @jwc/jscad-hardware version 2.0.1 
 * https://github.com/johnwebbcole/jscad-hardware
 */
var jscadHardware = (function (exports, jscadUtils) {
  'use strict';

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
    console.warn('head', head);
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

}({}, jscadUtils));
/* @jwc/jscad-hardware follow me on Twitter! @johnwebbcole */

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
