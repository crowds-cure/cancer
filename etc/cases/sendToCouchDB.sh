# Getting a token
curl \
  -d 'client_id=couchdb' \
  -d 'username=admin' \
  -d 'password=YOUR_PASSWORD' \
  -d 'client_secret=YOUR_CLIENT_SECRET' \
  -d 'grant_type=password' \
  'https://cancer.crowds-cure.org/auth/realms/dcm4che/protocol/openid-connect/token' \
  | python -m json.tool

# Using a token
curl -H "Authorization: Bearer YOUR_TOKEN" \
	 https://db.crowds-cure.org/cases

# Pushing multiple docs into the db
# Note: we have an admin account on the db as well,
# so this has to be done from the host server
curl -X POST -H "Content-Type: application/json" -d @cases.json user:password@ip:port/cases/_bulk_docs