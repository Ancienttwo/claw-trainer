#!/bin/bash
# Prompt Guard — UserPromptSubmit
# Detect fix/feature requests and inject TDD/BDD context

PROMPT="$1"
if echo "$PROMPT" | grep -qEi "(fix|patch|bug)"; then
  echo "Detected fix request - Reminder: Write test to reproduce bug first, then delete module and rewrite"
fi
if echo "$PROMPT" | grep -qEi "(new feature|implement|add)"; then
  echo "Detected feature request - Reminder: Define Given-When-Then acceptance criteria first"
fi
