#!/bin/bash
rm -r ./build
mkdir build
cp -R ./public/dist ./build/public
cp -R ./server ./build/server
rm -R ./build/server/node_modules
cp ./app.js ./build/app.js