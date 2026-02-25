#!/bin/bash

DIR=$( cd "$( dirname "$0" )" && pwd )

# Ensure submodules are initialized
git -C "$DIR" submodule update --init

docker run --rm -v $DIR:/data \
        -v /mirror:/mirror \
        -v /mirror2:/mirror2 \
        tunathu/mirror-web bash -c '/data/geninfo/z-geninfo/genisolist.py /data/geninfo/genisolist.ini | tee /data/_site/static/status/isoinfo.json'
