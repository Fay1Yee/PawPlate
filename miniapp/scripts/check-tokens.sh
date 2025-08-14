#!/usr/bin/env bash
ALLOW='#F6C642|#E59A00|#FF8A3D|#35C26B|#FFF6E3|#FFF9EB|#3A2E16|#6B5B35|#F0E3C8'
BAD=$(git diff --cached --name-only | grep -E '\.(ttss|ttml|css)$' | xargs -I{} grep -nE '#[0-9A-Fa-f]{3,6}' {} | grep -Ev "$ALLOW" || true)
if [ -n "$BAD" ]; then
  echo "❌ 检测到非 tokens 的颜色："
  echo "$BAD"
  echo "请改用 tokens.ttss 类或在 pawplate_tokens.json 中登记"
  exit 1
fi
