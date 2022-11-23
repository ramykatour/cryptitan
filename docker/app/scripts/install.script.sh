#!/usr/bin/env bash
set -euo pipefail

php artisan backup:database
php artisan migrate --force
php artisan db:seed --force
php artisan exchanger:install
php artisan geoip:update
php artisan vendor:publish --tag=coin-assets

if [ -e "/var/scripts/post-install.script.sh" ]; then
    /var/scripts/post-install.script.sh
fi