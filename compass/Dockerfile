# This Dockerfile must be execute with higher context, because firstly we have to create react components lib with local changes.
# If you want to build image without local changes of react components, delete 16 line of code.
FROM node:12.16.0-alpine3.9 as builder
ARG app_name=compass
WORKDIR /app

# Install global dependencies
RUN apk update && \
  apk upgrade && \
  apk add --no-cache curl make

# Install root and app dependencies
COPY . /app
RUN cd /app/${app_name} && \
  make resolve && \
  make verify


# Set env variables
ENV PRODUCTION true
ENV CI true

# Test & Build
RUN cd /app/${app_name} && make build

### Main image ###
FROM alpine:3.15.6

### Update apk repositories for the latest nginx
RUN printf "%s%s%s\n" \
  "http://nginx.org/packages/alpine/v" \
  `egrep -o '^[0-9]+\.[0-9]+' /etc/alpine-release` \
  "/main" \
  | tee -a /etc/apk/repositories
RUN curl -o /tmp/nginx_signing.rsa.pub https://nginx.org/keys/nginx_signing.rsa.pub \
  && mv /tmp/nginx_signing.rsa.pub /etc/apk/keys/

### Install nginx package and remove cache ###
RUN apk add --update nginx && rm -rf /var/cache/apk/*

LABEL source git@github.com:kyma-project/console.git
ARG app_name=compass

COPY ./${app_name}/nginx.conf /etc/nginx/nginx.conf
COPY ./${app_name}/start.sh /
COPY --from=builder /app/${app_name}/build var/public
COPY --from=builder /app/${app_name}/public-luigi var/public-luigi

RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 81 8888

CMD ["./start.sh", "/etc/nginx/nginx.conf"]
