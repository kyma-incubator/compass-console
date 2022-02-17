NGINX_CONFIG="$1"
sed -i "s,\$allowedConnectSrc,$ALLOWED_CONNECT_SRC,g" $NGINX_CONFIG
nginx -g daemon off;