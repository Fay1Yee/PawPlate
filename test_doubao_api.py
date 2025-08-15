#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json

# 豆包AI API配置
API_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
API_KEY = "e779c50a-bc8c-4673-ada3-30c4e7987018"

def test_api():
    """测试豆包API"""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "doubao-pro-32k-240515",
        "messages": [
            {
                "role": "user",
                "content": "你好，请告诉我豆包AI是否支持图像生成功能？"
            }
        ],
        "max_tokens": 100
    }
    
    try:
        print("正在测试豆包API...")
        print(f"URL: {API_URL}")
        print(f"Headers: {headers}")
        print(f"Data: {json.dumps(data, indent=2, ensure_ascii=False)}")
        
        response = requests.post(API_URL, headers=headers, json=data, timeout=30)
        print(f"\n状态码: {response.status_code}")
        print(f"响应头: {dict(response.headers)}")
        print(f"响应内容: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("\n✅ API调用成功!")
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"\n❌ API调用失败: {response.status_code}")
            
    except Exception as e:
        print(f"❌ 请求失败: {e}")

if __name__ == "__main__":
    test_api()