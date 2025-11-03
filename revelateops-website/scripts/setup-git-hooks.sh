#!/bin/bash
# Setup Git Hooks for Brand Compliance
# Run this script to install the pre-commit hook: ./scripts/setup-git-hooks.sh

echo "🔧 Setting up Git hooks for brand compliance..."

# Create the pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
# Brand Color Compliance Pre-Commit Hook
# Automatically checks for hardcoded brand colors before each commit

echo "🎨 Running brand color compliance check..."

# Get staged TypeScript/TSX files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$' | grep -E '^(app|components)/')

if [ -z "$STAGED_FILES" ]; then
  echo "✅ No TypeScript files to check"
  exit 0
fi

# Run brand linter on staged files only
npm run lint:brand -- $STAGED_FILES 2>&1 | grep -E "(error|warning).*brand/no-hardcoded-colors"

LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -eq 0 ]; then
  echo ""
  echo "⚠️  Brand color compliance issues detected in staged files!"
  echo ""
  echo "Please fix hardcoded colors before committing:"
  echo "  • Replace hardcoded hex values with semantic tokens"
  echo "  • Reference: app/globals.css for brand color tokens"
  echo "  • Auto-fix: npm run lint:brand:fix"
  echo ""
  echo "Staged files with issues:"
  echo "$STAGED_FILES"
  echo ""
  echo "To bypass this check (not recommended):"
  echo "  git commit --no-verify"
  echo ""
  exit 1
fi

echo "✅ Brand color compliance check passed!"
exit 0
EOF

# Make it executable
chmod +x .git/hooks/pre-commit

echo "✅ Git hooks installed successfully!"
echo ""
echo "The pre-commit hook will now automatically check for hardcoded brand colors."
echo "To test it, try: git commit -m 'test'"
echo ""
