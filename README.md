# Running on Production Server

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

## Troubleshooting

### 404 error when attempting to load website

- Delete the client `build` directory, and rebuild the project
