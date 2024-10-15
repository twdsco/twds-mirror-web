#!/bin/bash

DIR=$( cd "$( dirname "$0" )" && pwd )
[[ $- != *i* ]] && export it="-it"

docker run "${it}" --rm -v $DIR:/data -v /mirror:/mirror tunathu/mirror-web bash -c '/data/geninfo/genisolist.py | tee /data/_site/static/status/isoinfo.json'
