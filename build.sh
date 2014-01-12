#!/bin/bash
rm -r ./build
mkdir build
cd ./public
grunt build
cd ..
cp -R ./public/dist ./build/public
rm -R ./public/dist
cp -R ./server ./build/server
rm -R ./build/server/node_modules
cp ./app.js ./build/app.js

FILE=$(find build/public/scripts/ -name *scripts.js)
sed -i "" -e "s/localhost:8080/www.hstrny.com:9007/g" $FILE