const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class RealImageService {
  constructor() {
    // 支持多个AI图片生成服务
    this.services = {
      // Stability AI (Stable Diffusion)
      stability: {
        apiKey: process.env.STABILITY_API_KEY,
        baseURL: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      // 豆包 (字节跳动)
      doubao: {
        apiKey: process.env.DOUBAO_API_KEY,
        baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
        headers: {
          'Authorization': `Bearer ${process.env.DOUBAO_API_KEY}`,
          'Content-Type': 'application/json'
        }
      },
      // OpenAI DALL-E
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: 'https://api.openai.com/v1/images/generations',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    };
    
    this.imageDir = path.join(__dirname, '../public/images/ai-generated');
    this.ensureImageDir();
  }

  async ensureImageDir() {
    try {
      await fs.access(this.imageDir);
    } catch {
      await fs.mkdir(this.imageDir, { recursive: true });
    }
  }

  // 生成图片的主要方法
  async generateImage(prompt, options = {}) {
    const {
      category = 'products',
      size = '1024x1024',
      style = 'realistic',
      service = 'stability' // 默认使用Stability AI
    } = options;
    
    // 确保Stability AI使用支持的尺寸
    let adjustedSize = size;
    if (service === 'stability') {
      const supportedSizes = ['1024x1024', '1152x896', '1216x832', '1344x768', '1536x640', '640x1536', '768x1344', '832x1216', '896x1152'];
      if (!supportedSizes.includes(size)) {
        adjustedSize = '1024x1024'; // 默认使用1024x1024
        console.log(`⚠️ 尺寸 ${size} 不被Stability AI支持，使用 ${adjustedSize}`);
      }
    }

    console.log(`🎨 开始生成图片: ${prompt}`);
    console.log(`📐 尺寸: ${size}, 🎭 风格: ${style}, 🔧 服务: ${service}`);

    try {
      let imageUrl;
      
      switch (service) {
        case 'stability':
          imageUrl = await this.generateWithStability(prompt, { size: adjustedSize, style });
          break;
        case 'doubao':
          imageUrl = await this.generateWithDoubao(prompt, { size, style });
          break;
        case 'openai':
          imageUrl = await this.generateWithOpenAI(prompt, { size, style });
          break;
        default:
          throw new Error(`不支持的服务: ${service}`);
      }

      if (imageUrl) {
        const fileName = await this.downloadAndSave(imageUrl, prompt, category);
        console.log(`✅ 图片生成成功: ${fileName}`);
        return {
          success: true,
          fileName,
          localPath: `/images/ai-generated/${category}/${fileName}`,
          originalUrl: imageUrl
        };
      }
    } catch (error) {
      console.error(`❌ 图片生成失败: ${error.message}`);
      // 生成占位符图片作为后备
      const placeholderPath = await this.generatePlaceholder(prompt, category);
      return {
        success: false,
        error: error.message,
        placeholderPath,
        localPath: placeholderPath
      };
    }
  }

  // Stability AI 图片生成
  async generateWithStability(prompt, options) {
    const { size, style } = options;
    const [width, height] = size.split('x').map(Number);
    
    const stylePrompt = this.getStylePrompt(style);
    const fullPrompt = `${stylePrompt}, ${prompt}`;
    
    const requestBody = {
      text_prompts: [
        {
          text: fullPrompt,
          weight: 1
        },
        {
          text: 'blurry, bad quality, distorted, ugly, low resolution, text, watermark',
          weight: -1
        }
      ],
      cfg_scale: 7,
      height,
      width,
      samples: 1,
      steps: 30
    };

    const response = await axios.post(
      this.services.stability.baseURL,
      requestBody,
      { headers: this.services.stability.headers }
    );

    if (response.data.artifacts && response.data.artifacts[0]) {
      const base64Image = response.data.artifacts[0].base64;
      return `data:image/png;base64,${base64Image}`;
    }
    
    throw new Error('Stability AI 返回数据格式错误');
  }

  // 豆包图片生成 (模拟实现)
  async generateWithDoubao(prompt, options) {
    const { size } = options;
    
    const requestBody = {
      model: 'doubao-seedream-3-0-t2i-250415',
      prompt: prompt,
      response_format: 'url',
      size: size === '1024x1024' ? '1024x1024' : '512x512',
      guidance_scale: 3,
      watermark: true
    };

    const response = await axios.post(
      this.services.doubao.baseURL + '/images/generations',
      requestBody,
      { headers: this.services.doubao.headers }
    );

    if (response.data.data && response.data.data[0]) {
      return response.data.data[0].url;
    }
    
    throw new Error('豆包图片生成返回数据格式错误');
  }

  // OpenAI DALL-E 图片生成
  async generateWithOpenAI(prompt, options) {
    const { size } = options;
    
    const requestBody = {
      prompt: prompt,
      n: 1,
      size: size === '1024x1024' ? '1024x1024' : '512x512',
      response_format: 'url'
    };

    const response = await axios.post(
      this.services.openai.baseURL,
      requestBody,
      { headers: this.services.openai.headers }
    );

    if (response.data.data && response.data.data[0]) {
      return response.data.data[0].url;
    }
    
    throw new Error('OpenAI DALL-E 返回数据格式错误');
  }

  // 获取风格提示词
  getStylePrompt(style) {
    const styles = {
      cartoon: 'cartoon style, cute, warm colors, soft lighting, friendly appearance',
      realistic: 'photorealistic, high quality, professional photography, natural lighting',
      minimalist: 'minimalist design, clean, simple, modern, flat design',
      glassmorphism: 'glassmorphism style, frosted glass effect, soft shadows, warm yellow tones, modern UI design'
    };
    
    return styles[style] || styles.cartoon;
  }

  // 下载并保存图片
  async downloadAndSave(imageUrl, prompt, category) {
    const fileName = this.generateFileName(prompt);
    const categoryDir = path.join(this.imageDir, category);
    const filePath = path.join(categoryDir, fileName);
    
    // 确保分类目录存在
    await fs.mkdir(categoryDir, { recursive: true });
    
    if (imageUrl.startsWith('data:')) {
      // Base64 图片
      const base64Data = imageUrl.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      await fs.writeFile(filePath, buffer);
    } else {
      // URL 图片
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      await fs.writeFile(filePath, response.data);
    }
    
    return fileName;
  }

  // 生成占位符图片
  async generatePlaceholder(prompt, category) {
    const fileName = this.generateFileName(prompt, 'svg');
    const categoryDir = path.join(this.imageDir, category);
    const filePath = path.join(categoryDir, fileName);
    
    await fs.mkdir(categoryDir, { recursive: true });
    
    const svg = this.createPlaceholderSVG(prompt);
    await fs.writeFile(filePath, svg);
    
    return `/images/ai-generated/${category}/${fileName}`;
  }

  // 创建占位符SVG
  createPlaceholderSVG(prompt) {
    const hash = crypto.createHash('md5').update(prompt).digest('hex').substring(0, 6);
    const color = `#${hash}`;
    
    return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}20"/>
      <rect x="50" y="50" width="300" height="200" rx="20" fill="${color}40"/>
      <circle cx="200" cy="120" r="30" fill="${color}"/>
      <rect x="80" y="180" width="240" height="20" rx="10" fill="${color}60"/>
      <rect x="120" y="220" width="160" height="15" rx="7" fill="${color}40"/>
      <text x="200" y="320" text-anchor="middle" font-family="Arial" font-size="14" fill="${color}">
        ${prompt.substring(0, 20)}...
      </text>
    </svg>`;
  }

  // 生成文件名
  generateFileName(prompt, ext = 'png') {
    const hash = crypto.createHash('md5').update(prompt).digest('hex').substring(0, 8);
    const timestamp = Date.now();
    const safeName = prompt.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').substring(0, 20);
    return `${safeName}_${hash}_${timestamp}.${ext}`;
  }

  // 批量生成图片
  async batchGenerate(imageJobs) {
    console.log(`🚀 开始批量生成 ${imageJobs.length} 张图片...`);
    
    const results = [];
    for (let i = 0; i < imageJobs.length; i++) {
      const job = imageJobs[i];
      console.log(`📸 [${i + 1}/${imageJobs.length}] 生成: ${job.key}`);
      
      try {
        const result = await this.generateImage(job.prompt, {
          category: job.category || 'products',
          size: job.size || '1024x1024',
          style: job.style || 'cartoon',
          service: job.service || 'stability'
        });
        
        results.push({
          key: job.key,
          ...result
        });
        
        // 避免API限制，添加延迟
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`❌ 生成失败 ${job.key}: ${error.message}`);
        results.push({
          key: job.key,
          success: false,
          error: error.message
        });
      }
    }
    
    console.log(`✅ 批量生成完成！成功: ${results.filter(r => r.success).length}/${results.length}`);
    return results;
  }
}

module.exports = RealImageService;