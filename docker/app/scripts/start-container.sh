#!/usr/bin/env bash
set -euo pipefail

usermod -u "$HOST_UID" server

RUN="gosu $HOST_UID"

trap exit SIGQUIT SIGINT SIGTERM

if [ ! -e "$APP_INSTALLED_FILE" ]; then
	eval "$RUN" mkdir -p storage/backups
	eval "$RUN" php artisan view:clear
	eval "$RUN" php artisan config:clear
	eval "$RUN" php artisan route:clear

	if [ "$APP_ENV" == "production" ]; then
	    eval "$RUN" npm install --omit=dev
	    eval "$RUN" composer install -o --no-dev

		# Make backup of .env file
		ENV_BACKUP_PATH="storage/backups/.env.backup."
		eval "$RUN" rm -f "$(ls -td ${ENV_BACKUP_PATH}* | awk 'NR>5')"
        eval "$RUN" cp .env "${ENV_BACKUP_PATH}$(date +%s)"

        eval "$RUN" npm run production

		eval "$RUN" php artisan view:cache
		eval "$RUN" php artisan config:cache
		eval "$RUN" php artisan route:cache
	fi

	eval "$RUN" php artisan storage:link

	if [ -e "/var/scripts/install.script.sh" ]; then
        eval "$RUN" /var/scripts/install.script.sh
    fi

	touch "$APP_INSTALLED_FILE"
fi

if [ -e "/var/scripts/start.script.sh" ]; then
	eval "$RUN" /var/scripts/start.script.sh
fi

if [ "$APP_SCHEDULE" == "true" ]; then
	eval "$RUN" crontab /var/schedule.cron
	service cron restart
fi

if [ $# -gt 0 ]; then
	exec gosu "$HOST_UID" "$@"
else
	exec /usr/bin/supervisord --nodaemon \
		--configuration=/var/supervisord.conf \
		--user=server
fi

