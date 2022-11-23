ARG REDIS_VERSION

FROM redis:${REDIS_VERSION}

COPY config/ /usr/local/etc/redis/

RUN cd /usr/local/etc/redis && (test -f redis.conf || cp default.conf redis.conf)

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]