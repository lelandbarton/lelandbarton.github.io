#!/bin/bash


set -e


#cd $WSHOME/lelandbarton.github.io/
cd src
rsync -avI . bartonleland@lelandbarton.com:/home/bartonleland/www
cd -
