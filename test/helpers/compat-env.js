import jsCadCSG from '@jscad/csg';
import scadApi from '@jscad/scad-api';
const { CSG, CAG } = jsCadCSG;
// console.warn('scadApi', scadApi);
// import { init as utilInit } from '@jwc/jscad-utils';
import '@jwc/jscad-utils/dist/compat.js';

global.CSG = CSG;
global.CAG = CAG;
global.jsCadCSG = jsCadCSG;
global.scadApi = scadApi;
global.vector_text = scadApi.text.vector_text;
global.vector_char = scadApi.text.vector_char;
global.rectangular_extrude = scadApi.extrusions.rectangular_extrude;
global.cube = scadApi.primitives3d.cube;
global.sphere = scadApi.primitives3d.sphere;
global.cylinder = scadApi.primitives3d.cylinder;

global.union = scadApi.booleanOps.union;
global.jscadUtilsDebug = { enabled: [], disabled: [] };

util.init(CSG);

// console.warn('CSG', CSG);
// console.warn('jscadUtils', util, util.init);
