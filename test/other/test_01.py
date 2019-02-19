import os
import json
import time

# 7.047126, 79.931007

#7.081347, 79.957967

lat = 79.931007
latPlus = 0.002246667

lon = 7.047126
lonPlus = 0.00285175


for i in range(12):
    data = {}
    data['user_id'] = 2
    data['lat'] = lat + (i*latPlus)
    data['lon'] = lon + (i*lonPlus)
    data['timestamp'] = int(time.time()*1000)


    dataStr = json.dumps(data)
    commandPart = """curl "http://localhost:3000/api/public/location-update" -H "Content-Type: application/json" --request POST --data """
    command  = commandPart + "'" + dataStr + "'"

    res = os.system(command)
    print(res)
    time.sleep(20)
