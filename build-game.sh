#!/bin/sh
set -eu
cat game-src/*.js > game.js
echo "game.js assembled from game-src/*.js"
