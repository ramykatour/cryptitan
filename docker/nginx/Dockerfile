ARG NGINX_VERSION

FROM nginx:${NGINX_VERSION}

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d /etc/nginx/conf.d
COPY templates /etc/nginx/templates
COPY includes /etc/nginx/includes

EXPOSE 80
EXPOSE 443
EXPOSE 2095
EXPOSE 2096