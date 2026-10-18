#!/usr/bin/env python3
"""Validate the localized SICL command-alias registry.

This validator is intentionally fail-closed: proposed aliases may be reviewed,
but malformed, ambiguous, cross-locale, or catalog-inconsistent entries fail.
It does not execute commands or contact the Core.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

SUPPORTED_LOCALES = {"es", "en", "pt", "it", "fr", "de", "ru", "zh"}
VALID_STATUSES = {"PROPOSED", "REVIEWED", "DOMAIN_REVIEWED", "ACTIVE", "DEPRECATED", "REJECTED"}
REVIEWED_STATUSES = {"REVIEWED", "DOMAIN_REVIEWED", "ACTIVE", "DEPRECATED"}
CONTROL_CHARS = re.compile(r"[\x00-\x1f\x7f]")


def normalize_alias(value: str) -> str:
    value = unicodedata.normalize("NFC", value)
    value = re.sub(r"\s+", " ", value.strip())
    return value.casefold()


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def validate(registry_path: Path, catalog_path: Path) -> list[str]:
    errors: list[str] = []
    registry = load_json(registry_path)
    catalog = load_json(catalog_path)

    if not isinstance(registry, dict):
        return ["registry root must be an object"]
    if not isinstance(catalog, list):
        return ["canonical catalog root must be an array"]

    canonical_names = {item.get("name") for item in catalog if isinstance(item, dict)}
    canonical_names.discard(None)
    expected = registry.get("canonical_catalog", {}).get("expected_command_count")
    if expected != len(canonical_names):
        errors.append(f"catalog count mismatch: registry expects {expected}, actual is {len(canonical_names)}")

    locales = registry.get("supported_locales")
    if set(locales or []) != SUPPORTED_LOCALES:
        errors.append(f"supported_locales must equal {sorted(SUPPORTED_LOCALES)}")
    if registry.get("status") not in {"PROPOSED", "REVIEWED", "ACTIVE"}:
        errors.append("registry status must be PROPOSED, REVIEWED, or ACTIVE")
    activation_policy = registry.get("activation_policy")
    allowed_policies = {
        "NO_ACTIVE_ALIASES_UNTIL_PO_APPROVAL",
        "PRODUCT_OWNER_APPROVED_FR_DE_ONLY",
        "PRODUCT_OWNER_APPROVED_ALL_LOCALES",
    }
    if activation_policy not in allowed_policies:
        errors.append("activation_policy is not recognized")

    entries = registry.get("entries")
    if not isinstance(entries, list) or not entries:
        return errors + ["entries must be a non-empty array"]

    by_locale_alias: dict[tuple[str, str], list[dict]] = defaultdict(list)
    by_alias_all_locales: dict[str, list[dict]] = defaultdict(list)
    active_count = 0
    for index, entry in enumerate(entries):
        prefix = f"entries[{index}]"
        if not isinstance(entry, dict):
            errors.append(f"{prefix} must be an object")
            continue
        required = {"locale", "alias", "canonical", "status", "preferred", "review_status", "reviewer", "notes"}
        missing = required - entry.keys()
        if missing:
            errors.append(f"{prefix} missing fields: {', '.join(sorted(missing))}")
            continue
        locale = entry["locale"]
        alias = entry["alias"]
        canonical = entry["canonical"]
        status = entry["status"]
        review_status = entry["review_status"]
        if locale not in SUPPORTED_LOCALES:
            errors.append(f"{prefix} unsupported locale: {locale}")
        if not isinstance(alias, str) or not alias.startswith("/") or alias == "/":
            errors.append(f"{prefix} alias must begin with / and contain a command")
        if isinstance(alias, str) and CONTROL_CHARS.search(alias):
            errors.append(f"{prefix} alias contains control characters")
        if canonical not in canonical_names:
            errors.append(f"{prefix} canonical command is absent from catalog: {canonical}")
        if status not in VALID_STATUSES:
            errors.append(f"{prefix} invalid status: {status}")
        if not isinstance(entry["preferred"], bool):
            errors.append(f"{prefix} preferred must be boolean")
        if not isinstance(entry["notes"], str) or not entry["notes"].strip():
            errors.append(f"{prefix} notes must be non-empty")
        if status == "ACTIVE":
            active_count += 1
            if review_status not in REVIEWED_STATUSES:
                errors.append(f"{prefix} ACTIVE alias lacks linguistic/domain review")
            if registry.get("status") != "ACTIVE":
                errors.append(f"{prefix} ACTIVE alias is forbidden while registry status is {registry.get('status')}")
        if review_status == "ACTIVE":
            errors.append(f"{prefix} review_status must describe review, not activation")
        if locale == "en" and alias != canonical:
            errors.append(f"{prefix} English alias must equal canonical form in this base registry")
        if isinstance(alias, str) and isinstance(locale, str):
            normalized = normalize_alias(alias)
            by_locale_alias[(locale, normalized)].append(entry)
            by_alias_all_locales[normalized].append(entry)

    for (locale, normalized), collisions in by_locale_alias.items():
        destinations = {item.get("canonical") for item in collisions}
        if len(destinations) > 1:
            errors.append(f"collision in locale {locale}: {normalized!r} maps to {sorted(destinations)}")
        if len(collisions) > 1 and len(destinations) == 1:
            errors.append(f"duplicate alias in locale {locale}: {normalized!r}")

    # Cross-locale equality is not automatically invalid, but it is reported so
    # the reviewer can decide whether the shared spelling is intentional.
    shared = {key: items for key, items in by_alias_all_locales.items() if len({i.get('locale') for i in items}) > 1}
    for normalized, items in sorted(shared.items()):
        destinations = {item.get("canonical") for item in items}
        if len(destinations) > 1:
            errors.append(f"cross-locale collision: {normalized!r} maps to {sorted(destinations)}")

    if active_count and registry.get("status") != "ACTIVE":
        errors.append("active aliases exist but registry status is not ACTIVE")
    if activation_policy == "PRODUCT_OWNER_APPROVED_FR_DE_ONLY":
        active_entries = [entry for entry in entries if entry.get("status") == "ACTIVE"]
        active_locales = {entry.get("locale") for entry in active_entries}
        if active_locales != {"fr", "de"}:
            errors.append(f"limited activation must contain only fr/de, found {sorted(active_locales)}")
        if len(active_entries) > 12:
            errors.append("limited activation cannot exceed 12 active aliases")
    if activation_policy == "PRODUCT_OWNER_APPROVED_ALL_LOCALES":
        active_locales = {entry.get("locale") for entry in entries if entry.get("status") == "ACTIVE"}
        if active_locales != SUPPORTED_LOCALES:
            errors.append(f"all-locale activation must contain {sorted(SUPPORTED_LOCALES)}, found {sorted(active_locales)}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--registry", type=Path, default=Path("client/src/content/command-aliases.json"))
    parser.add_argument("--catalog", type=Path, default=Path("client/src/content/commands-catalog.json"))
    args = parser.parse_args()
    try:
        errors = validate(args.registry, args.catalog)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    if errors:
        print(f"INVALID: {len(errors)} error(s)")
        for error in errors:
            print(f"- {error}")
        return 1
    registry = load_json(args.registry)
    print("VALID")
    print(f"- entries: {len(registry['entries'])}")
    print(f"- locales: {', '.join(registry['supported_locales'])}")
    print(f"- status: {registry['status']}")
    active = sum(1 for entry in registry["entries"] if entry.get("status") == "ACTIVE")
    print(f"- active aliases: {active}")
    print(f"- activation policy: {registry.get('activation_policy')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
