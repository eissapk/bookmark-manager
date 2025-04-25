#! /bin/bash

platform="$(uname | tr '[:upper:]' '[:lower:]')"

if [ "$platform" == 'linux' ]
then 
  ./node/linux/node index.js $1 $2 $3 $4 $5 $6 $7 $8 $9 $10
elif [ "$platform" == 'darwin' ]
then
  ./node/mac/node index.js $1 $2 $3 $4 $5 $6 $7 $8 $9 $10
else 
  echo $platform
  echo "Your OS neither linux nor mac"
fi
