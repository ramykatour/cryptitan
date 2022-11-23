#!/usr/bin/env bash
set -euo pipefail

if [ -e "/var/scripts/post-start.script.sh" ]; then
	/var/scripts/post-start.script.sh
fi