# TWDS Mirrors

Fork from tuna/mirror-web
License with GPLv2

### Build In Docker

```
cd mirror-web
docker build -t builden -f Dockerfile.build .
docker run -it -v /path/to/mirror-web/:/data builden
```

Download following assets before build

```
wget https://mirrors.tuna.tsinghua.edu.cn/static/tunasync.json -O static/tunasync.json
mkdir -p static/status
wget https://mirrors.tuna.tsinghua.edu.cn/static/status/isoinfo.json -O static/status/isoinfo.json
```
