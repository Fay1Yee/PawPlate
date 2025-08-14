#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

async function testStabilityAPI() {
  console.log('🧪 测试 Stability AI API...');
  console.log('🔑 API Key:', process.env.STABILITY_API_KEY ? '已配置' : '未配置');
  
  if (!process.env.STABILITY_API_KEY) {
    console.error('❌ STABILITY_API_KEY 未配置');
    return;
  }

  const requestBody = {
    text_prompts: [
      {
        text: 'a cute orange cat sitting in a modern kitchen, realistic style, high quality',
        weight: 1
      },
      {
        text: 'blurry, bad quality, distorted, ugly, low resolution, text, watermark',
        weight: -1
      }
    ],
    cfg_scale: 7,
    height: 1024,
    width: 1024,
    samples: 1,
    steps: 30
  };

  const headers = {
    'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  try {
    console.log('📤 发送请求到 Stability AI...');
    console.log('🌐 URL:', 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image');
    console.log('📝 请求体:', JSON.stringify(requestBody, null, 2));
    
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      requestBody,
      { headers }
    );

    console.log('✅ API 调用成功!');
    console.log('📊 响应状态:', response.status);
    console.log('📄 响应数据结构:', {
      hasArtifacts: !!response.data.artifacts,
      artifactsCount: response.data.artifacts?.length || 0,
      firstArtifactKeys: response.data.artifacts?.[0] ? Object.keys(response.data.artifacts[0]) : []
    });
    
    if (response.data.artifacts && response.data.artifacts[0]) {
      const base64Image = response.data.artifacts[0].base64;
      console.log('🖼️ 图片数据长度:', base64Image?.length || 0);
      console.log('✅ 图片生成成功!');
    } else {
      console.log('❌ 响应中没有图片数据');
    }
    
  } catch (error) {
    console.error('❌ API 调用失败:');
    console.error('状态码:', error.response?.status);
    console.error('错误信息:', error.response?.data || error.message);
    console.error('完整错误:', error.response?.data);
  }
}

if (require.main === module) {
  testStabilityAPI();
}

module.exports = { testStabilityAPI };