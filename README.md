# Running on Production Server

## Deploy on the droplet

From the repo root (`~/PlanShare` or wherever the clone lives):

```
./deploy.sh
```

That pulls the latest `master`, installs dependencies, builds the client, and restarts the server (port 36322) and static client (port 36321). Use `./deploy.sh --clean` if you need a full wipe of `node_modules` and `client/build` first.

pm2 is used when it is installed; otherwise the script falls back to `screen`, matching the historical droplet setup.

## Serving the client

Navigate to the client directory:

```
cd client
```

Build the client project:

```
yarn build
```

Serve the client project:

```
serve -l 36321 -s build
```

The following should be outputted:

```
Serving!

- Local:            http://localhost:36321
- On Your Network:  http://146.190.63.193:36321
```

## Serving the server

```
cd server
```

Build the server project:

```
yarn
```

Serve the server:

```
yarn start
```

For the remote server, use:

```
pm2 start "sh" --name planshare-server -- -c "yarn start"
```

The following should be outputted:

```
Server is running on Port 36322...
```

## Forward porting

Open the editor for the default nginx site file:

```
sudo vim /etc/nginx/sites-available/default
```

Add and save the following configurations:

```
server {
	listen 80;
	server_name planshare.io;
	rewrite ^/(.*) https://planshare.io/$1 permanent;
}

server {
	listen 443 ssl;

	server_name planshare.io;
	ssl_certificate /root/planshare.io.crt;
	ssl_certificate_key /root/planshare.io.key;
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	ssl_prefer_server_ciphers on;
	ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

	location / {
		proxy_pass http://localhost:36321;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}

	location /backend/ {
		proxy_pass http://localhost:36322/;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}

	location /socket/ {
		proxy_pass http://localhost:36322/socket.io/;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
}
```

Restart the ngix service:

```
sudo systemctl restart nginx
```

## Internal insights API

The marketing admin dashboard at multiworldlabs.com/admin reads registered-user counts from a private JSON endpoint. Do not link this URL from the public app.

The public site is `https://planshare.io`. The API is the same host under `/backend/` (see nginx `location /backend/` in this README). Dashboard env:

```
PLANSHARE_INSIGHTS_URL=https://planshare.io/backend/api/internal/insights
PLANSHARE_INSIGHTS_SECRET=<same value as INSIGHTS_SECRET>
```

Set `INSIGHTS_SECRET` in the server process environment (see `.env.example`). If the secret is missing or the `Authorization` header is missing/wrong, the endpoint returns `401` with `{ "error": "Unauthorized" }`.

```
curl -sS -H "Authorization: Bearer $INSIGHTS_SECRET" https://planshare.io/backend/api/internal/insights
```

This counts documents in the MongoDB `Users` collection (accounts created at signup with an email and username). It does not count listings, conversations, or anonymous visitors.

## Troubleshooting

### 404 error when attempting to load website

- Delete the client `build` directory, and rebuild the project
