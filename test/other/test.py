import os
import json
import time

lat = 79.936725
latPlus = 0.00086243333

lon = 7.0497139
lonPlus = 0.00179396666


for i in range(12):
    data = {}
    data['user_id'] = 1
    data['lat'] = lat + (i*latPlus)
    data['lon'] = lon + (i*lonPlus)
    data['timestamp'] = int(time.time()*1000)


    dataStr = json.dumps(data)
    commandPart = """curl "http://localhost:3000/api/public/location-update" -H "Content-Type: application/json" --request POST --data """
    command  = commandPart + "'" + dataStr + "'"

    res = os.system(command)
    print(res)
    time.sleep(20)
