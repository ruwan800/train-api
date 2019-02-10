http://localhost:3000/api/public/location-update

mongoimport -d mta_location -c track_points --type json  --file ~/python/openstreetmap/railway_sorted_w_distance.json --jsonArray

mongoimport -d mta_location -c lines --type json  --file ~/python/openstreetmap/railway_lines.json --jsonArray

npm run dev

while sleep 1; do node ./dist/schedule.js; done

tail -100f log/app.log

python3 test/other/test.py 