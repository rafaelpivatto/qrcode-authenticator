# qrcode-authenticator

1. RUN `yarn start`

2. request a POST to generate qrcode:

```
curl --request POST \
  --url http://localhost:3000/auth \
  --header 'Content-Type: application/json' \
  --data '{
	"username": "USERNAME"
}'
```

3. Scan qrcode generated in root folder from authentication app, like google authentication, authy, etc.

4. POST to validate token:

```
curl --request POST \
  --url http://localhost:3000/verify \
  --header 'Content-Type: application/json' \
  --data '{
	"secret": "SECRET_HERE",
	"token": "TOKEN_HERE"
}'
```