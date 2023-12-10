#!/bin/bash

#
# Script executed every time nodemon restarts the development server.
# Ensures that typescript code in /server is re-built before the server is restarted.
#

set -e;

echo '[nodemon] rebuilding server'
./node_modules/.bin/tsc --build

echo '[nodemon] starting server'
./environment/development node server/build/index.js
