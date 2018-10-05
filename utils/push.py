import json
from subprocess import call

url = "https://k8s-testing.ohif.org/couchdb"
db = 'adjectives'
filename = 'adjectives.txt'
auth = "username:password"

with open(filename) as f:
    data = f.readlines()

f = open(filename)
data = f.readlines()
f.close()

for idx, value in enumerate(data):
	value = value.replace('\n', '')
	formattedData = json.dumps({ "name": value.lower() })
	print ["curl", "--user", auth, "-X", "PUT", url + "/" + db + "/" + str(idx), "-d", formattedData] 
	call(["curl", "--user", auth, "-X", "PUT", url + "/" + db + "/" + str(idx), "-d", formattedData])