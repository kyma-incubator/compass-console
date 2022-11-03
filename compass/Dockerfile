# This Dockerfile must be execute with higher context, because firstly we have to create react components lib with local changes.
# If you want to build image without local changes of react components, delete 16 line of code.
FROM node:12.16.3-stretch-slim as builder
ARG app_name=compass
WORKDIR /app

# Install global dependencies
RUN apt-get update && \
  apt-get install -y apt-utils && \
  apt-get install -y curl && \
  apt-get install -y make

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
FROM ubuntu/nginx:1.18-22.04_edge

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
