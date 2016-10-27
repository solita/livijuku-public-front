#!/bin/bash
#Purpose = Creating of a tar file that contains the files needed in production. TAR package have to be extracted on a target server.
#Created on 27.10.2016
#Author = Raimo Pitkänen
#Version 1.0

#START
set -e
BASEDIR=$(cd "$(dirname "$0")"; pwd)
cd $BASEDIR
./build.sh
FILENAME=$(ls production)
scp production/$FILENAME liviwlst110l:/opt/livijuku/environment/.
scp publish-remote.sh liviwlst110l:/opt/livijuku/environment/.
ssh liviwlst110l /opt/livijuku/environment/publish-remote.sh $FILENAME
#END
