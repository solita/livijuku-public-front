#!/bin/bash
#Purpose = Creating of a tar file that contains the files needed in production. TAR package have to be extracted on a target server.
#Created on 26.10.2016
#Author = Raimo Pitkänen
#Version 1.0

#START
TARGETDIR=production
FILENAME=juku.tar.gz
DESTINATIONDIR=production

# Location of scripts directory (source of tar file).
SRC1=scripts/
SRC2=locales/
SRC3=bower_components/
SRC4=images
SRC5=index.html

createTARGZ() {
  echo "Creating the package..."
  tar -cpzf $DESTINATIONDIR/$FILENAME $SRC1 $SRC2 $SRC3 $SRC4 $SRC5
  echo "Package $FILENAME created to directory '$TARGETDIR'!"
}

if [ ! -d $TARGETDIR ]
then
  echo "Directory 'production' doesn't exist. Creating now..."
  mkdir -p "$TARGETDIR"
  echo "Directory created!"
  createTARGZ
else
  if [ -f $DESTINATIONDIR/$FILENAME ]
  then
    read -p "File $FILENAME already exists. Do you want to replace it with the new one (n/Y)? " override
    override=${override:-Y}
    if [ $override == "Y" ] || [ $override == "y" ]
    then
      createTARGZ
    else
      echo "Operation cancelled"
    fi
  else
    echo "Creating $FILENAME.tar.gz file..."
    createTARGZ
  fi
fi
#END
