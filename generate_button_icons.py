#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json
import os
import time
from urllib.parse import urlparse
from urllib.request import urlretrieve

# 豆包AI图像生成API配置
API_URL = "https://ark.cn-beijing.volces.com/api/v3/images/generations"
API_KEY = "e779c50a-bc8c-4673-ada3-30c4e7987018"

# 配色方案
COLORS = {
    "primary": "#F8F34A",         # 柠檬黄
    "primary_lime": "#C8FF4D",    # 荧光绿
    "accent_orange": "#FFA73A", 
    "accent_pink": "#FF6FAE", 
    "accent_sky": "#8FD2FF", 
    "ink": "#141414", 
    "bg": "#FFFBF0",              # 奶白
    "card": "#FFFFFF", 
    "stroke": "#EFEFEF", 
    "halo": "rgba(255,255,0,.25)"
}

# 按钮图标配置
BUTTON_ICONS = [
    {
        "name": "cart",
        "filename": "cart.png",
        "prompt": "插画扁平卡通多巴胺风格的购物车图标，高饱和度色彩，透明背景，只保留彩色图形，圆角设计，可爱简洁，使用橙色#FFA73A作为主色调，柠檬黄#F8F34A作为高光，现代简约风格",
        "description": "购物车图标"
    },
    {
        "name": "heart", 
        "filename": "heart.png",
        "prompt": "插画扁平卡通多巴胺风格的爱心图标，高饱和度色彩，透明背景，只保留彩色图形，圆角设计，可爱简洁，使用粉色#FF6FAE作为主色调，柠檬黄#F8F34A作为高光，温馨可爱风格",
        "description": "爱心收藏图标"
    },
    {
        "name": "share",
        "filename": "share.png", 
        "prompt": "插画扁平卡通多巴胺风格的分享图标，高饱和度色彩，透明背景，只保留彩色图形，圆角设计，可爱简洁，使用天蓝色#8FD2FF作为主色调，柠檬黄#F8F34A作为高光，友好分享风格",
        "description": "分享图标"
    },
    {
        "name": "video",
        "filename": "video.png",
        "prompt": "插画扁平卡通多巴胺风格的视频播放图标，高饱和度色彩，透明背景，只保留彩色图形，圆角设计，可爱简洁，使用橙色#FFA73A作为主色调，柠檬黄#F8F34A作为高光，三角播放符号",
        "description": "视频播放图标"
    },
    {
        "name": "edit",
        "filename": "edit.png",
        "prompt": "插画扁平卡通多巴胺风格的编辑图标，高饱和度色彩，透明背景，只保留彩色图形，圆角设计，可爱简洁，使用天蓝色#8FD2FF作为主色调，柠檬黄#F8F34A作为高光，铅笔编辑符号",
        "description": "编辑图标"
    },
    {
        "name": "add-pet",
        "filename": "add-pet.png",
        "prompt": "插画扁平卡通多巴胺风格的添加宠物图标，高饱和度色彩，透明背景，只保留彩色图形，圆角设计，可爱简洁，使用荧光绿#C8FF4D作为主色调，柠檬黄#F8F34A作为高光，加号和小狗小猫轮廓",
        "description": "添加宠物图标"
    },
    {
        "name": "ai-customize",
        "filename": "ai-customize.png",
        "prompt": "插画扁平卡通多巴胺风格的AI定制图标，高饱和度色彩，透明背景，只保留彩色图形，圆角设计，可爱简洁，使用粉色#FF6FAE作为主色调，柠檬黄#F8F34A作为高光，机器人或魔法棒符号",
        "description": "AI定制图标"
    },
    {
        "name": "start-cooking",
        "filename": "start-cooking.png",
        "prompt": "插画扁平卡通多巴胺风格的开始制作图标，高饱和度色彩，透明背景，只保留彩色图形，圆角设计，可爱简洁，使用橙色#FFA73A作为主色调，柠檬黄#F8F34A作为高光，厨师帽或锅铲符号",
        "description": "开始制作图标"
    },
    {
        "name": "try-recipe",
        "filename": "try-recipe.png",
        "prompt": "插画扁平卡通多巴胺风格的尝试菜谱图标，高饱和度色彩，透明背景，只保留彩色图形，圆角设计，可爱简洁，使用荧光绿#C8FF4D作为主色调，柠檬黄#F8F34A作为高光，餐具或食物符号",
        "description": "尝试菜谱图标"
    },
    {
        "name": "new-tip",
        "filename": "new-tip.png",
        "prompt": "插画扁平卡通多巴胺风格的新提示图标，高饱和度色彩，透明背景，只保留彩色图形，圆角设计，可爱简洁，使用天蓝色#8FD2FF作为主色调，柠檬黄#F8F34A作为高光，灯泡或提示符号",
        "description": "新提示图标"
    }
]

def generate_image_with_doubao(prompt, filename):
    """使用豆包AI生成图片"""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "doubao-seedream-3-0-t2i-250415",
        "prompt": prompt,
        "response_format": "url",
        "size": "1024x1024",
        "guidance_scale": 3,
        "watermark": True
    }
    
    try:
        print(f"正在为 {filename} 生成图片...")
        response = requests.post(API_URL, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        if 'data' in result and len(result['data']) > 0:
            image_url = result['data'][0]['url']
            
            # 下载图片
            image_path = f"/Users/zephyruszhou/Documents/DOU2025/PawPlate/miniapp/images/icons/{filename}"
            urlretrieve(image_url, image_path)
            print(f"✅ {filename} 生成成功")
            return True
        else:
            print(f"❌ {filename} 生成失败: 无效的响应数据")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ {filename} 生成失败: 网络请求错误 - {e}")
        return False
    except Exception as e:
        print(f"❌ {filename} 生成失败: {e}")
        return False

def main():
    """主函数"""
    print("🎨 开始生成统一风格的按钮图标...")
    print(f"📁 图标将保存到: /Users/zephyruszhou/Documents/DOU2025/PawPlate/miniapp/images/icons/")
    print(f"🎯 总共需要生成 {len(BUTTON_ICONS)} 个图标")
    print("🎨 风格: 插画扁平卡通多巴胺风格，高饱和度，透明背景，圆角设计")
    print("\n" + "="*50)
    
    success_count = 0
    
    for i, icon_config in enumerate(BUTTON_ICONS, 1):
        print(f"\n[{i}/{len(BUTTON_ICONS)}] {icon_config['description']}")
        print(f"文件名: {icon_config['filename']}")
        
        if generate_image_with_doubao(icon_config['prompt'], icon_config['filename']):
            success_count += 1
        
        # 添加延迟避免API限制
        if i < len(BUTTON_ICONS):
            print("⏳ 等待2秒...")
            time.sleep(2)
    
    print("\n" + "="*50)
    print(f"🎉 图标生成完成!")
    print(f"✅ 成功: {success_count}/{len(BUTTON_ICONS)}")
    
    if success_count < len(BUTTON_ICONS):
        print(f"❌ 失败: {len(BUTTON_ICONS) - success_count}")
    
    print(f"📁 所有图标已保存到: /Users/zephyruszhou/Documents/DOU2025/PawPlate/miniapp/images/icons/")

if __name__ == "__main__":
    main()