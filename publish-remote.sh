#!/bin/bash
#Purpose = Copy livijuku-public-front to the right directory and extract it.
#Created on 27.10.2016
#Author = Raimo Pitk�nen
#Version 0.1.0

#START
set -e
BASEDIR=$(cd "$(dirname "$0")"; pwd)
cd $BASEDIR
mv $1 /var/www/html/public/
cd /var/www/html/public
rm -rf juku
mkdir -p juku
mv $1 juku
cd juku
tar zxvf $1
rm $1
cd ..
chgrp -R appadmin juku
chmod -R g+w juku
