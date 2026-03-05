# TWDS Mirror Web

The web frontend for [TWDS Open Source Mirror](https://mirror.twds.com.tw).

Forked from [tuna/mirror-web](https://github.com/tuna/mirror-web). Licensed under GPLv2.

## Configuration

- **`_config.yml`** - Jekyll site settings (site title, URLs, branding, plugins)
- **`_data/options.yml`** - Mirror list, mirror descriptions, label mappings
- **`geninfo/genisolist.ini`** - ISO image detection rules for the download page (uses [mirrorz-org/genisolist](https://github.com/mirrorz-org/genisolist) as a submodule)

## Prerequisites

- Ruby 3.2+ (with Bundler)
- Node.js 22+ (see `.nvmrc`)

```bash
git clone --recursive https://github.com/twdsco/twds-mirror-web.git
cd twds-mirror-web
git submodule update --init --recursive
```

## Local Development

```bash
bundle install
npm ci
bundle exec jekyll serve
```

The Vite build is automatically triggered by `jekyll-vite.rb` during `jekyll serve`/`jekyll build`.

Download dynamic data for a complete local preview:

```bash
wget https://mirror.twds.com.tw/static/tunasync.json -O static/tunasync.json
mkdir -p static/status
wget https://mirror.twds.com.tw/static/status/isoinfo.json -O static/status/isoinfo.json
```

## Production Build

### Local

```bash
bundle install
npm ci
JEKYLL_ENV=production bundle exec jekyll build
```

Output is in `_site/`.

### Docker

```bash
./build.sh          # auto-builds image on first run
./build.sh --build  # force rebuild the Docker image
```

Note: `rebuild-iso.sh` (called at the end of `build.sh`) requires `/mirror` and `/mirror2` volumes mounted from the production server.

## Regenerate ISO Info

```bash
./rebuild-iso.sh
```

This runs `geninfo/genisolist.py` against the local mirror tree and outputs `static/status/isoinfo.json`.
