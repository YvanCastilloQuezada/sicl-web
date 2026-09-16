#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CORE_REPO_PATH="${SICL_CORE_PATH:-${REPO_ROOT}/../sicl-core}"
SOURCE_DIR="${CORE_REPO_PATH}/docs"
TARGET_DIR="${REPO_ROOT}/client/src/content/manuals"
PDF_DIR="${REPO_ROOT}/client/public/manuals"

if [[ ! -d "${SOURCE_DIR}" ]]; then
  echo "ERROR: Core repository not found at ${CORE_REPO_PATH}" >&2
  echo "Set SICL_CORE_PATH to a local sicl-core checkout." >&2
  exit 1
fi

mkdir -p "${TARGET_DIR}" "${PDF_DIR}"
for manual in USER_MANUAL OPERATIONS_MANUAL COMMANDS_REFERENCE; do
  source="${SOURCE_DIR}/${manual}.md"
  target="${TARGET_DIR}/${manual}.md"
  if [[ ! -f "${source}" ]]; then
    echo "ERROR: missing ${source}" >&2
    exit 1
  fi
  cp "${source}" "${target}"
done

manus-md-to-pdf "${TARGET_DIR}/USER_MANUAL.md" "${PDF_DIR}/user-manual.pdf"
manus-md-to-pdf "${TARGET_DIR}/OPERATIONS_MANUAL.md" "${PDF_DIR}/operations-manual.pdf"
manus-md-to-pdf "${TARGET_DIR}/COMMANDS_REFERENCE.md" "${PDF_DIR}/commands-reference.pdf"

echo "Manuals and PDFs synchronized successfully from ${CORE_REPO_PATH}."
