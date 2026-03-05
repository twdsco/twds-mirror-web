#!/bin/bash

DIR=$( cd "$( dirname "$0" )" && pwd )
IMAGE="twds/mirror-web"
[[ $- != *i* ]] && export it="-it"

# Build the Docker image if it doesn't exist or if --build is passed
if [[ "$1" == "--build" ]] || ! docker image inspect "$IMAGE" &>/dev/null; then
    docker build -f "$DIR/Dockerfile.build" -t "$IMAGE" "$DIR"
fi

docker run "${it}" --rm -v "$DIR:/data" "$IMAGE"
docker run "${it}" --rm -v "$DIR:/data" "$IMAGE" rm -v /data/_site/static/status/isoinfo.json /data/_site/static/tunasync.json

"$DIR/rebuild-iso.sh"
