ARG PHP_VERSION

FROM php:${PHP_VERSION}-fpm

LABEL maintainer="NeoScrypts"

ARG APP_ENV
ARG PHP_VERSION
ARG COMPOSER_VERSION
ARG NODE_VERSION
ARG DEBIAN_FRONTEND=noninteractive
ARG HOST_GID

ENV TZ=UTC
ENV APP_INSTALLED_FILE=/var/app.installed

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install system dependencies
RUN apt-get update && apt-get install -y sqlite3 curl nano cron \
    zip unzip supervisor ca-certificates gosu mariadb-client

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm && \
    apt-get -y autoremove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions mysqli pgsql sqlite3 curl memcached opcache swoole \
    xml zip pcntl bcmath soap readline msgpack igbinary ldap gd imap ctype redis \
    fileinfo json pdo pdo_mysql tokenizer mbstring intl @composer-${COMPOSER_VERSION}

RUN if [ "$APP_ENV" = "local" -o "$APP_ENV" = "testing" ]; then \
    mv "${PHP_INI_DIR}/php.ini-development" "${PHP_INI_DIR}/php.ini"; \
    install-php-extensions xdebug; else \
    mv "${PHP_INI_DIR}/php.ini-production" "${PHP_INI_DIR}/php.ini"; fi

RUN mkdir -p /var/log/supervisor
RUN mkdir -p /var/scripts

COPY scripts/*.script.sh /var/scripts/
COPY scripts/start-container.sh /usr/local/bin/start-container
COPY supervisord.conf /var/supervisord.conf
COPY conf.d/*.ini ${PHP_INI_DIR}/conf.d/
COPY schedule.cron /var/schedule.cron

RUN groupadd --force -g $HOST_GID server
RUN useradd -g $HOST_GID -mNs /bin/bash server

RUN chmod -R +x /var/scripts
RUN chmod u+x /usr/local/bin/start-container
RUN chmod 0644 /var/schedule.cron

WORKDIR /var/www/html

EXPOSE 8080

ENTRYPOINT ["start-container"]
