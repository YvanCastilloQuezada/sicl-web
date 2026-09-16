#!/usr/bin/env bash
set -euo pipefail

# Prepare a server-only environment file for SICL Core connectivity.
# Usage: ./scripts/prepare_core_env.sh [output-file]
# The token is read without echo and is never printed.

output_file="${1:-.sicl-core.env}"
if [[ "$output_file" == *"/"* ]]; then
  mkdir -p "$(dirname "$output_file")"
fi

read -r -p "SICL Core HTTPS URL (without trailing slash): " core_url
read -r -s -p "SICL Core service token: " core_token
echo

if [[ ! "$core_url" =~ ^https://[^/[:space:]]+$ ]]; then
  echo "ERROR: SICL_CORE_URL must be an HTTPS origin without a trailing slash." >&2
  exit 2
fi
if [[ -z "$core_token" || "$core_token" =~ [[:space:]] ]]; then
  echo "ERROR: SICL_CORE_SERVICE_TOKEN must be non-empty and contain no whitespace." >&2
  exit 2
fi

umask 077
tmp_file="$(mktemp "${output_file}.XXXXXX")"
cleanup() { rm -f "$tmp_file"; }
trap cleanup EXIT
printf 'SICL_CORE_URL=%q\nSICL_CORE_SERVICE_TOKEN=%q\n' "$core_url" "$core_token" > "$tmp_file"
chmod 600 "$tmp_file"
mv -f "$tmp_file" "$output_file"
trap - EXIT

unset core_token
printf 'Created %s with mode 600. Token value was not displayed.\n' "$output_file"
printf 'Load server-side only with: set -a; source %q; set +a\n' "$output_file"
printf 'Never copy this file into client/, VITE_* variables, or Git.\n'
