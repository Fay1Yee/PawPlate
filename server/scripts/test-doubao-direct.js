const axios = require('axios');
require('dotenv').config();

async function testDoubaoAPI() {
  console.log('🧪 测试豆包API直接调用...');
  console.log('API Key:', process.env.DOUBAO_API_KEY);
  
  const requestBody = {
    model: 'doubao-seedream-3-0-t2i-250415',
    prompt: 'Chicken and vegetable bowl, lean chicken breast with fresh broccoli, carrots and herbs, arranged in modern pet bowl, soft lighting, sensitive stomach friendly meal',
    response_format: 'url',
    size: '1024x1024',
    guidance_scale: 3,
    watermark: true
  };
  
  const headers = {
    'Authorization': `Bearer ${process.env.DOUBAO_API_KEY}`,
    'Content-Type': 'application/json'
  };
  
  console.log('请求URL:', 'https://ark.cn-beijing.volces.com/api/v3/images/generations');
  console.log('请求头:', headers);
  console.log('请求体:', JSON.stringify(requestBody, null, 2));
  
  try {
    const response = await axios.post(
      'https://ark.cn-beijing.volces.com/api/v3/images/generations',
      requestBody,
      { headers }
    );
    
    console.log('✅ 成功!');
    console.log('响应状态:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    
    if (response.data.data && response.data.data[0]) {
      console.log('🖼️ 图片URL:', response.data.data[0].url);
    }
    
  } catch (error) {
    console.error('❌ 失败!');
    console.error('错误状态:', error.response?.status);
    console.error('错误信息:', error.response?.data || error.message);
    console.error('完整错误:', error.toJSON ? error.toJSON() : error);
  }
}

testDoubaoAPI();