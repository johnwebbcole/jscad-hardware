function main() {
  util.init(CSG);
  var washer = Hardware.Washer(ImperialWashers['1/4']);

  return washer.combine('washer');
}

// include:js
// endinject
