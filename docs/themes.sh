#!/bin/bash

set -e
rm -rf themes
mkdir -p themes

dl() {
  URL=https://pages-themes.github.io/$1/assets/css/style.css
  FILE=themes/$1/css/style.css

  mkdir -p themes/$1/css

  curl -Ss $URL -o $FILE && {
    echo "$1 ok"
    pushd themes/$1/css
    for url in `sed -n -e 's/.*url(\([^)]*\).*/\1/p' style.css`; do
      # echo "$(dirname $url)"
      ASSET=${url//\"}
      DIRNAME=$(dirname $ASSET)
      echo "downloading $ASSET into $DIRNAME"
      mkdir -p $DIRNAME
      curl -Ss https://pages-themes.github.io/$1/assets/css/$ASSET -o $ASSET
    done
    popd
  } || {
    echo "$1 error$?"
  }
}

dl architect
# dl caymen
# dl dinky
# dl hacker
# dl leap-day
# dl merlot
# dl midnight
# dl minima
# dl minimal
# dl modernist
# dl slate
# dl tactile
# dl time-machine
