http://localhost:3000/api/public/location-update

#### MONGO
{lat: {$gt: 6.785618-0.01, $lt: 6.785618+0.01}}

mongoimport -d mta_location -c track_points --type json  --file ~/python/openstreetmap/railway_sorted_w_distance.json --jsonArray

mongoimport -d mta_location -c lines --type json  --file ~/python/openstreetmap/railway_lines.json --jsonArray

npm run dev

while sleep 1; do node ./dist/schedule.js; done

tail -100f log/app.log

python3 test/other/test.py 

http://localhost:3000/api/public/trains
{"success":true,"data":[{_id line_id position velocity}]}

http://localhost:3000/api/public/location-update

***** update
{user_id, lat, lon, timestamp}

***** response
{"success":true,"message":"train id:1550083412, p:16.288247471855662, v-20.121922306106857"}


***** stations
http://157.230.166.94:3000/api/public/stations
{"_id":10,"name":"Aluthgama","position":59.452,"line_id":1}

#### CURL 
curl "http://157.230.166.94:3000/api/public/location-update" -H "Content-Type: application/json" --request POST --data '{"user_id": 1, "timestamp": $(date +"%s"), "lat": , "lon": }' 