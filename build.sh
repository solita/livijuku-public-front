#!/bin/bash
#Purpose = Creating of a tar file that contains the files needed in production. TAR package have to be extracted on a target server.
#Created on 26.10.2016
#Author = Raimo Pitkänen
#Version 1.0

#START
set -e
TARGETDIR=production
DESTINATIONDIR=production
VERSION=$(grep version package.json | cut -d'"' -f4)

now=$(/bin/date +%FT%T%z|sed -e 's/:/-/g')

if [[ $VERSION == *"SNAPSHOT"* ]]; then
    FILENAME=public-juku-dist-$VERSION-$now-$(hostname).tar.gz
else
    FILENAME=public-juku-dist-$VERSION-$(hostname).tar.gz
fi

# Location of scripts directory (source of tar file).
SRC1=scripts/
SRC2=locales/
SRC3=bower_components/
SRC4=images
SRC5=index.html

createTARGZ() {
  echo "Creating the package..."
  gtar -czf $DESTINATIONDIR/$FILENAME $SRC1 $SRC2 $SRC3 $SRC4 $SRC5
  echo "Package $FILENAME created to directory '$TARGETDIR'!"
}

createTargetDir() {
  mkdir -p "$TARGETDIR"
}

au build --env prod

rm -rf $TARGETDIR
createTargetDir
createTARGZ
#END