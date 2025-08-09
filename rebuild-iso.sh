#!/bin/bash

DIR=$( cd "$( dirname "$0" )" && pwd )

docker run --rm -v $DIR:/data \
        -v /mirror:/mirror \
        -v /mirror2:/mirror2 \
        tunathu/mirror-web bash -c '/data/geninfo/genisolist.py | tee /data/_site/static/status/isoinfo.json'
