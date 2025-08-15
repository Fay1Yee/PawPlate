#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

# 创建图标目录
icons_dir = "/Users/zephyruszhou/Documents/DOU2025/PawPlate/miniapp/images/icons"
os.makedirs(icons_dir, exist_ok=True)

# 配色方案
colors = {
    "primary": "#F8F34A",         # 柠檬黄
    "primary_lime": "#C8FF4D",    # 荧光绿
    "accent_orange": "#FFA73A",   # 橙色
    "accent_pink": "#FF6FAE",     # 粉色
    "accent_sky": "#8FD2FF",      # 天蓝
    "ink": "#141414",             # 墨色
    "bg": "#FFFBF0",              # 奶白
    "card": "#FFFFFF",            # 白色
    "stroke": "#EFEFEF"           # 描边
}

# 图标定义
icons = {
    "cart": {
        "name": "购物车图标",
        "svg": f'''<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="12" fill="{colors['bg']}"/>
  <path d="M14 16h3l1.68 8.39a2 2 0 0 0 1.97 1.61h9.72a2 2 0 0 0 1.97-1.61L34 20H20" stroke="{colors['accent_orange']}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="21" cy="33" r="2" fill="{colors['accent_orange']}"/>
  <circle cx="31" cy="33" r="2" fill="{colors['accent_orange']}"/>
</svg>'''
    },
    "heart": {
        "name": "爱心图标",
        "svg": f'''<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="12" fill="{colors['bg']}"/>
  <path d="M24 34.5c-7-5.5-12-10-12-16a6 6 0 0 1 12 0 6 6 0 0 1 12 0c0 6-5 10.5-12 16z" fill="{colors['accent_pink']}" stroke="{colors['accent_pink']}" stroke-width="1.5"/>
</svg>'''
    },
    "share": {
        "name": "分享图标",
        "svg": f'''<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="12" fill="{colors['bg']}"/>
  <circle cx="18" cy="24" r="3" fill="{colors['accent_sky']}"/>
  <circle cx="30" cy="16" r="3" fill="{colors['accent_sky']}"/>
  <circle cx="30" cy="32" r="3" fill="{colors['accent_sky']}"/>
  <path d="m21 22 6-4M21 26l6 4" stroke="{colors['accent_sky']}" stroke-width="2" stroke-linecap="round"/>
</svg>'''
    },
    "video": {
        "name": "视频菜谱图标",
        "svg": f'''<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="12" fill="{colors['bg']}"/>
  <rect x="12" y="16" width="24" height="16" rx="4" fill="{colors['primary']}" stroke="{colors['primary']}" stroke-width="1.5"/>
  <path d="m20 20 6 4-6 4v-8z" fill="{colors['ink']}"/>
</svg>'''
    },
    "edit": {
        "name": "编辑图标",
        "svg": f'''<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="12" fill="{colors['bg']}"/>
  <path d="M16 32h3l9-9-3-3-9 9v3z" fill="{colors['primary_lime']}"/>
  <path d="m25 17 3 3" stroke="{colors['primary_lime']}" stroke-width="2" stroke-linecap="round"/>
  <path d="M32 20v12a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V20" stroke="{colors['stroke']}" stroke-width="1.5"/>
</svg>'''
    },
    "add-pet": {
        "name": "添加宠物图标",
        "svg": f'''<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="12" fill="{colors['bg']}"/>
  <path d="M24 16v16M16 24h16" stroke="{colors['accent_orange']}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="20" cy="18" r="2" fill="{colors['accent_pink']}"/>
  <circle cx="28" cy="18" r="2" fill="{colors['accent_pink']}"/>
</svg>'''
    },
    "ai-customize": {
        "name": "AI定制图标",
        "svg": f'''<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="12" fill="{colors['bg']}"/>
  <circle cx="24" cy="24" r="8" fill="{colors['primary']}" opacity="0.3"/>
  <path d="M24 18v12M18 24h12" stroke="{colors['primary']}" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="24" cy="24" r="3" fill="{colors['accent_sky']}"/>
</svg>'''
    },
    "start-cooking": {
        "name": "开始制作图标",
        "svg": f'''<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="12" fill="{colors['bg']}"/>
  <path d="m20 18 8 6-8 6V18z" fill="{colors['accent_orange']}"/>
  <circle cx="24" cy="24" r="12" stroke="{colors['accent_orange']}" stroke-width="2" fill="none"/>
</svg>'''
    },
    "try-recipe": {
        "name": "尝试菜谱图标",
        "svg": f'''<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="12" fill="{colors['bg']}"/>
  <path d="M18 20h12v12a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V20z" fill="{colors['primary_lime']}" opacity="0.7"/>
  <path d="M22 16v4M26 16v4" stroke="{colors['primary_lime']}" stroke-width="2" stroke-linecap="round"/>
  <circle cx="22" cy="26" r="1" fill="{colors['ink']}"/>
  <circle cx="26" cy="26" r="1" fill="{colors['ink']}"/>
</svg>'''
    },
    "new-tip": {
        "name": "新提示图标",
        "svg": f'''<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="12" fill="{colors['bg']}"/>
  <path d="M24 16a8 8 0 0 1 8 8c0 2-1 4-3 5v3a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-3c-2-1-3-3-3-5a8 8 0 0 1 8-8z" fill="{colors['primary']}" opacity="0.8"/>
  <path d="M21 36h6" stroke="{colors['ink']}" stroke-width="2" stroke-linecap="round"/>
</svg>'''
    }
}

# 生成SVG图标文件
for icon_key, icon_data in icons.items():
    filename = f"{icon_key}.svg"
    filepath = os.path.join(icons_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(icon_data['svg'])
    
    print(f"✅ 已生成 {icon_data['name']}: {filename}")

print(f"\n🎉 所有图标已生成完成！保存在: {icons_dir}")
print(f"共生成 {len(icons)} 个卡通插画风格的按钮图标")