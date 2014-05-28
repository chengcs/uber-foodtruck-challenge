import pymongo
import json
import requests

# Connect to mongodb database
connection = pymongo.Connection()
coll = connection.test.foodtrucks

# Ensure collection is empty before adding all foodtrucks
coll.remove()

# Pull data from json URL and insert into database
r = requests.get('http://data.sfgov.org/resource/rqzj-sfat.json')
data = json.loads(r.text)

d = []
# Adds foodtrucks that have status of APPROVED and has a location provided
for i in range(len(data)):
	cur = data[i]
	if cur['status']=='APPROVED':
		if cur.has_key('location') is True:
			# specifically for mongodb geospatial queries
			cur['loc'] = [float(cur['longitude']), float(cur['latitude'])]

			d.append(cur)
coll.insert(d)
