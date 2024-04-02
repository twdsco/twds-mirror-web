#!/bin/bash

W=800
H=400
tmp=$(mktemp -d)

for t in "light" "dark"
do
for p in "1h" "3h" "6h" "24h"
do
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?scale=3&theme=$t&panelId=1&from=now-$p&width="$W"&height="$H -O "$tmp"/"$t"_traffic_"$p".png &
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?scale=3&theme=$t&panelId=5&from=now-$p&width="$W"&height="$H -O "$tmp"/"$t"_connection_"$p".png &
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?scale=3&theme=$t&panelId=3&from=now-$p&width="$W"&height="$H -O "$tmp"/"$t"_disk1_"$p".png &
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?scale=3&theme=$t&panelId=4&from=now-$p&width="$W"&height="$H -O "$tmp"/"$t"_disk2_"$p".png &
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?scale=3&theme=$t&panelId=6&from=now-$p&width="$W"&height="$H -O "$tmp"/"$t"_cpu_"$p".png &
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?scale=3&theme=$t&panelId=7&from=now-$p&width="$W"&height="$H -O "$tmp"/"$t"_memory_"$p".png &
for pid in `jobs -p`
do
wait $pid
done
sleep 1
done
done

mv "$tmp"/* /srv/tunasync/mirror-web/_site/static/status/
rm -r "$tmp"
