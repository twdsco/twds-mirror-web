# TWDS Mirror Web

The web frontend for [TWDS Open Source Mirror](https://mirror.twds.com.tw).

Forked from [tuna/mirror-web](https://github.com/tuna/mirror-web). Licensed under GPLv2.

## Configuration

- **`_config.yml`** - Jekyll site settings (site title, URLs, branding, plugins)
- **`_data/options.yml`** - Mirror list, mirror descriptions, label mappings
- **`geninfo/genisolist.ini`** - ISO image detection rules for the download page (uses [mirrorz-org/genisolist](https://github.com/mirrorz-org/genisolist) as a submodule)

## Prerequisites

```bash
git clone --recursive https://github.com/twdsco/twds-mirror-web.git
cd twds-mirror-web
git submodule update --init --recursive
```

## Build in Docker

```bash
./build.sh
```

Download the following dynamic data before building:

```bash
wget https://mirror.twds.com.tw/static/tunasync.json -O static/tunasync.json
mkdir -p static/status
wget https://mirror.twds.com.tw/static/status/isoinfo.json -O static/status/isoinfo.json
```

## Local Development

```bash
bundle install
bundle exec jekyll serve
```

## Regenerate ISO Info

```bash
./rebuild-iso.sh
```

This runs `geninfo/genisolist.py` against the local mirror tree and outputs `static/status/isoinfo.json`.
