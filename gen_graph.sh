#!/bin/bash

for t in "light" "dark"
do
for p in "1h" "3h" "6h" "24h"
do
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?theme=$t&panelId=1&from=now-$p&width=1000&height=500" -O /srv/tunasync/mirror-web/_site/static/status/"$t"_traffic_"$p".png
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?theme=$t&panelId=5&from=now-$p&width=1000&height=500" -O /srv/tunasync/mirror-web/_site/static/status/"$t"_connection_"$p".png
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?theme=$t&panelId=3&from=now-$p&width=1000&height=500" -O /srv/tunasync/mirror-web/_site/static/status/"$t"_disk1_"$p".png
wget -q "http://127.0.0.1:3000/render/d-solo/ddhj7whaercw0e/mirror-monitor?theme=$t&panelId=4&from=now-$p&width=1000&height=500" -O /srv/tunasync/mirror-web/_site/static/status/"$t"_disk2_"$p".png
done
done
