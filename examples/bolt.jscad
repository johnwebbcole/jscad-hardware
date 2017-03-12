function main() {
    util.init(CSG);

    var bolt = Hardware.Bolt(
      util.inch(1),
      ImperialBolts['5/16 hex'],
      'close'
    )

    return bolt.combine('head,thread');
}

// include:js
// endinject