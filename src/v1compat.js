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
