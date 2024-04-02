#!/bin/bash

W=545
H=273
tmp=$(mktemp -d)
for t in "light" "dark"
do
for p in "1h" "3h" "6h" "24h"
do
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?theme=$t&panelId=1&from=now-$p&width="$W"&height="$H -O "$tmp"/"$t"_traffic_"$p".png
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?theme=$t&panelId=5&from=now-$p&width="$W"&height="$H -O "$tmp"/"$t"_connection_"$p".png
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?theme=$t&panelId=3&from=now-$p&width="$W"&height="$H -O "$tmp"/"$t"_disk1_"$p".png
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?theme=$t&panelId=4&from=now-$p&width="$W"&height="$H -O "$tmp"/"$t"_disk2_"$p".png
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?theme=$t&panelId=6&from=now-$p&width="$W"&height="$H -O "$tmp"/"$t"_cpu_"$p".png
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?theme=$t&panelId=7&from=now-$p&width="$W"&height="$H -O "$tmp"/"$t"_memory_"$p".png
done
done
mv "$tmp"/* /srv/tunasync/mirror-web/_site/static/status/
rm -r "$tmp"
