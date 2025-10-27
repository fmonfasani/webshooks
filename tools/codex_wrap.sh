#!/usr/bin/env bash
set -euo pipefail
mkdir -p .telemetry
TS=$(date -Iseconds)
CMD="$*"
OUTFILE=".telemetry/${TS}_codex.log"
JSONL=".telemetry/codex_runs.jsonl"

{ time $CMD; } \
  > >(tee "$OUTFILE".stdout) \
  2> >(tee "$OUTFILE".stderr >&2)
EXIT=$?

# Resumen JSONL
jq -nc --arg ts "$TS" \
       --arg cmd "$CMD" \
       --arg out "$OUTFILE" \
       --arg status "$EXIT" \
       '{ts:$ts, cmd:$cmd, log:$out, exit:($status|tonumber)}' \
       >> "$JSONL"

exit $EXIT
