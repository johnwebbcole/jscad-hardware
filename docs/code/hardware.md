---
title: hardware
---

# hardware

<a name="module_jscad-hardware"></a>

## jscad-hardware : <code>Object</code>
A gear moduel for openJSCAD.
![parts example](jsdoc2md/hexagon.png)

**Example**  
```js
include('jscad-utils-color.jscad');

function mainx(params) {
  util.init(CSG);

  // draws a blue hexagon
  return Parts.Hexagon(10, 5).color('blue');
}
```

* [jscad-hardware](#module_jscad-hardware) : <code>Object</code>
    * [.Washer(washer, fit)](#module_jscad-hardware.Washer)
    * [.PanHeadScrew(headDiameter, headLength, diameter, length, clearLength, options)](#module_jscad-hardware.PanHeadScrew)
    * [.HexHeadScrew(headDiameter, headLength, diameter, length, clearLength, options)](#module_jscad-hardware.HexHeadScrew)
    * [.FlatHeadScrew(headDiameter, headLength, diameter, length, clearLength, options)](#module_jscad-hardware.FlatHeadScrew)

<a name="module_jscad-hardware.Washer"></a>

### jscad-hardware.Washer(washer, fit)
Create a washer group from a washer type.

**Kind**: static method of [<code>jscad-hardware</code>](#module_jscad-hardware)  

| Param | Type | Description |
| --- | --- | --- |
| washer | <code>Object</code> | Washer type object. |
| fit | <code>String</code> | Clearance to add to group (tap|close|loose). |

<a name="module_jscad-hardware.PanHeadScrew"></a>

### jscad-hardware.PanHeadScrew(headDiameter, headLength, diameter, length, clearLength, options)
Creates a `Group` object with a Pan Head Screw.

**Kind**: static method of [<code>jscad-hardware</code>](#module_jscad-hardware)  

| Param | Type | Description |
| --- | --- | --- |
| headDiameter | <code>number</code> | Diameter of the head of the screw |
| headLength | <code>number</code> | Length of the head |
| diameter | <code>number</code> | Diameter of the threaded shaft |
| length | <code>number</code> | Length of the threaded shaft |
| clearLength | <code>number</code> | Length of the clearance section of the head. |
| options | <code>object</code> | Screw options include orientation and clerance scale. |

<a name="module_jscad-hardware.HexHeadScrew"></a>

### jscad-hardware.HexHeadScrew(headDiameter, headLength, diameter, length, clearLength, options)
Creates a `Group` object with a Hex Head Screw.

**Kind**: static method of [<code>jscad-hardware</code>](#module_jscad-hardware)  

| Param | Type | Description |
| --- | --- | --- |
| headDiameter | <code>number</code> | Diameter of the head of the screw |
| headLength | <code>number</code> | Length of the head |
| diameter | <code>number</code> | Diameter of the threaded shaft |
| length | <code>number</code> | Length of the threaded shaft |
| clearLength | <code>number</code> | Length of the clearance section of the head. |
| options | <code>object</code> | Screw options include orientation and clerance scale. |

<a name="module_jscad-hardware.FlatHeadScrew"></a>

### jscad-hardware.FlatHeadScrew(headDiameter, headLength, diameter, length, clearLength, options)
Create a Flat Head Screw

**Kind**: static method of [<code>jscad-hardware</code>](#module_jscad-hardware)  

| Param | Type | Description |
| --- | --- | --- |
| headDiameter | <code>number</code> | head diameter |
| headLength | <code>number</code> | head length |
| diameter | <code>number</code> | thread diameter |
| length | <code>number</code> | thread length |
| clearLength | <code>number</code> | clearance length |
| options | <code>object</code> | options |

