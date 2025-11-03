/**
 * ESLint Rule: no-hardcoded-brand-colors
 *
 * Detects hardcoded hex color values in Tailwind CSS classes and suggests
 * semantic brand token replacements from globals.css
 *
 * Brand Color Mappings:
 * - #00d9ff → cyan (primary accent)
 * - #0084ff → blue (secondary accent)
 * - #d946ef → magenta (CTA only)
 * - #1a1f3a → navy (main background)
 * - #131735 → navy-ink (deeper contrast)
 * - #0A0F1E → navy-ink (deeper contrast)
 * - #f8fafc → surface (light backgrounds)
 * - #f1f5f9 → light-gray (cards)
 * - #dbe3f0 → border (dividers)
 * - #64748b → slate (secondary text)
 * - #334155 → charcoal (body text)
 */

const BRAND_COLORS = {
  '#00d9ff': 'cyan',
  '#00D9FF': 'cyan',
  '#0084ff': 'blue',
  '#0084FF': 'blue',
  '#d946ef': 'magenta',
  '#D946EF': 'magenta',
  '#1a1f3a': 'navy',
  '#1A1F3A': 'navy',
  '#131735': 'navy-ink',
  '#0A0F1E': 'navy-ink',
  '#0a0f1e': 'navy-ink',
  '#f8fafc': 'surface',
  '#F8FAFC': 'surface',
  '#f1f5f9': 'light-gray',
  '#F1F5F9': 'light-gray',
  '#dbe3f0': 'border',
  '#DBE3F0': 'border',
  '#64748b': 'slate',
  '#64748B': 'slate',
  '#334155': 'charcoal',
};

const TAILWIND_COLOR_PREFIXES = [
  'text-',
  'bg-',
  'border-',
  'from-',
  'via-',
  'to-',
  'ring-',
  'shadow-',
  'decoration-',
  'divide-',
  'outline-',
  'accent-',
  'caret-',
];

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow hardcoded hex color values in favor of semantic brand tokens',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      hardcodedColor: 'Hardcoded color "{{hex}}" detected. Use semantic token "{{token}}" instead.',
      unknownHardcodedColor: 'Hardcoded color "{{hex}}" detected. Consider adding to brand color system if needed.',
    },
  },

  create(context) {
    return {
      // Check className attributes in JSX
      JSXAttribute(node) {
        if (node.name.name !== 'className') return;

        const value = node.value;
        if (!value || value.type !== 'Literal') return;

        const classNames = String(value.value);
        checkClassNames(node, classNames, context);
      },

      // Check template literals with className
      TemplateLiteral(node) {
        // Only check if this is part of a className prop
        const parent = node.parent;
        if (parent && parent.type === 'JSXExpressionContainer') {
          const jsxParent = parent.parent;
          if (jsxParent && jsxParent.type === 'JSXAttribute' && jsxParent.name.name === 'className') {
            const classNames = node.quasis.map(q => q.value.cooked).join('');
            checkClassNames(node, classNames, context);
          }
        }
      },
    };
  },
};

function checkClassNames(node, classNames, context) {
  // Match Tailwind arbitrary value syntax: prefix-[#hexcode]
  const hexPattern = /([a-z-]+)-\[(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})\]/g;
  let match;

  while ((match = hexPattern.exec(classNames)) !== null) {
    const [fullMatch, prefix, hexValue] = match;
    const normalizedHex = normalizeHex(hexValue);
    const semanticToken = BRAND_COLORS[normalizedHex];

    // Only check if it's a Tailwind color utility
    const isColorUtility = TAILWIND_COLOR_PREFIXES.some(p => prefix.endsWith(p.slice(0, -1)));
    if (!isColorUtility) continue;

    if (semanticToken) {
      // Known brand color - suggest replacement
      const tokenClass = `${prefix}-${semanticToken}`;

      context.report({
        node,
        messageId: 'hardcodedColor',
        data: {
          hex: hexValue,
          token: tokenClass,
        },
        fix(fixer) {
          // Create fix by replacing the hardcoded value
          const sourceCode = context.getSourceCode();
          const text = sourceCode.getText(node);
          const newText = text.replace(fullMatch, tokenClass);
          return fixer.replaceText(node, newText);
        },
      });
    } else {
      // Unknown hardcoded color - warn
      context.report({
        node,
        messageId: 'unknownHardcodedColor',
        data: {
          hex: hexValue,
        },
      });
    }
  }
}

function normalizeHex(hex) {
  // Expand 3-char hex to 6-char
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}
