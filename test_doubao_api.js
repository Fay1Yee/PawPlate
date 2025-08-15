// 测试豆包推理模型API调用

const https = require('https');

const apiKey = 'e779c50a-bc8c-4673-ada3-30c4e7987018';
const model = 'doubao-seed-1-6-thinking-250715';

// 准备请求数据
const requestData = {
  model: model,
  messages: [
    {
      content: [
        {
          image_url: {
            url: "https://ark-project.tos-cn-beijing.ivolces.com/images/view.jpeg"
          },
          type: "image_url"
        },
        {
          text: "图片主要讲了什么?",
          type: "text"
        }
      ],
      role: "user"
    }
  ]
};

// 准备请求选项
const options = {
  hostname: 'ark.cn-beijing.volces.com',
  path: '/api/v3/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }
};

// 发送请求
const req = https.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应数据:');
    console.log(data);
    
    try {
      const jsonData = JSON.parse(data);
      if (jsonData.error) {
        console.error('API调用错误:', jsonData.error);
      } else {
        console.log('API调用成功!');
      }
    } catch (e) {
      console.error('解析响应数据失败:', e);
    }
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

// 写入请求数据
req.write(JSON.stringify(requestData));
req.end();

console.log('API请求已发送，等待响应...');