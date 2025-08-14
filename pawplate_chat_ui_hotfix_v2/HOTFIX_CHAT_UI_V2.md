
# Chat UI Hotfix v2
Fixes:
1) Wrong background color → set to warm yellow gradient.
2) Character overlap → set font-size 16px, line-height 24px, word-break.
3) Input dock too low → use safe-area and raise z-index; page bottom padding increased.

Files touched:
- pages/ai/chat/index.ttss
- app.ttss (added text defaults)

If dock仍然被遮挡，检查父容器是否有 `overflow:hidden`；若有，请去掉或改为 `visible`。
