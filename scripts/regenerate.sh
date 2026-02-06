#!/bin/bash
# Regenerate a module: delete implementation, keep spec/contract/tests
# Usage: ./scripts/regenerate.sh <module-name>

MODULE=$1

if [ -z "$MODULE" ]; then
  echo "Usage: ./scripts/regenerate.sh <module-name>"
  echo "Example: ./scripts/regenerate.sh nfa-mint"
  exit 1
fi

# Check in apps/web first
if [ -d "apps/web/src/modules/$MODULE" ]; then
  echo "Deleting implementation: apps/web/src/modules/$MODULE"
  rm -rf "apps/web/src/modules/$MODULE"
  mkdir -p "apps/web/src/modules/$MODULE"
elif [ -d "src/modules/$MODULE" ]; then
  echo "Deleting implementation: src/modules/$MODULE"
  rm -rf "src/modules/$MODULE"
  mkdir -p "src/modules/$MODULE"
else
  echo "Module not found in apps/web/src/modules/$MODULE or src/modules/$MODULE"
  exit 1
fi

echo "Module $MODULE cleared. Ready for rewrite."
echo ""
echo "Preserved assets:"
echo "  - specs/modules/$MODULE.spec.md"
echo "  - contracts/modules/$MODULE.contract.ts"
echo "  - tests/unit/$MODULE/"
echo "  - tests/integration/$MODULE/"
