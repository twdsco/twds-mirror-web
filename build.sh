#!/bin/bash

DIR=$( cd "$( dirname "$0" )" && pwd )

docker run -it --rm -v $DIR:/data tunathu/mirror-web
docker run -it --rm -v $DIR:/data tunathu/mirror-web rm -v /data/_site/static/status/isoinfo.json /data/_site/static/tunasync.json

"$DIR/rebuild-iso.sh"
