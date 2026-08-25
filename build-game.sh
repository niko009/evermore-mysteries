#!/bin/sh
set -eu
cat game-bundle/*.b64 | base64 -d | gzip -dc > game.js
echo "game.js restored from game-bundle/*.b64"
