#!/usr/bin/env bash
set -euo pipefail

# Validate server-side Core variables and perform read-only authenticated checks.
# Usage: set -a; source .sicl-core.env; set +a; ./scripts/check_core_env.sh

: "${SICL_CORE_URL:?SICL_CORE_URL is required}"
: "${SICL_CORE_SERVICE_TOKEN:?SICL_CORE_SERVICE_TOKEN is required}"

if [[ ! "$SICL_CORE_URL" =~ ^https://[^/[:space:]]+$ ]]; then
  echo "ERROR: SICL_CORE_URL must be an HTTPS origin without a trailing slash." >&2
  exit 2
fi

if [[ "$SICL_CORE_SERVICE_TOKEN" =~ [[:space:]] ]]; then
  echo "ERROR: SICL_CORE_SERVICE_TOKEN contains whitespace." >&2
  exit 2
fi

health_url="${SICL_CORE_URL}/health"
scales_url="${SICL_CORE_URL}/v1/scales"

printf 'Checking Core health: %s\n' "$health_url"
curl --fail-with-body --silent --show-error --max-time 20 "$health_url" >/tmp/sicl-core-health.$$
printf 'Health: PASS\n'
rm -f /tmp/sicl-core-health.$$

printf 'Checking authenticated /v1/scales: %s\n' "$scales_url"
response_file="$(mktemp)"
trap 'rm -f "$response_file"' EXIT
status="$(curl --silent --show-error --max-time 20 --output "$response_file" --write-out '%{http_code}' \
  -H "Authorization: Bearer ${SICL_CORE_SERVICE_TOKEN}" \
  -H 'Accept: application/json' \
  "$scales_url")"

case "$status" in
  200) printf 'Authenticated contract check: PASS (HTTP 200)\n' ;;
  401|403) printf 'Authenticated contract check: FAIL (HTTP %s: token rejected)\n' "$status" >&2; exit 3 ;;
  404) printf 'Authenticated contract check: FAIL (HTTP 404: wrong deployment or route)\n' >&2; exit 4 ;;
  *) printf 'Authenticated contract check: FAIL (HTTP %s)\n' "$status" >&2; exit 5 ;;
esac

if grep -Eiq 'SICL_CORE_SERVICE_TOKEN|authorization|bearer' "$response_file"; then
  echo "ERROR: response unexpectedly contains credential markers." >&2
  exit 6
fi

printf 'Core environment is ready for server-side injection.\n'
printf 'No token value was printed.\n'
