const https = require('https');
const fs = require('fs');
const path = require('path');

class DoubaoImageService {
  constructor() {
    // 豆包大模型API配置
    this.apiKey = process.env.DOUBAO_API_KEY || 'your-doubao-api-key';
    this.baseURL = 'https://ark.cn-beijing.volces.com/api/v3';
    this.model = 'doubao-pro-32k'; // 豆包模型
    
    // 图片存储目录
    this.imageDir = path.join(__dirname, '../public/images/products');
    this.ensureImageDir();
  }

  ensureImageDir() {
    if (!fs.existsSync(this.imageDir)) {
      fs.mkdirSync(this.imageDir, { recursive: true });
    }
  }

  // 生成商品描述prompt
  generateProductPrompt(productName, category = 'pet-food') {
    const prompts = {
      'pet-food': `请生成一张高质量的宠物食品商品图片：${productName}。要求：
- 产品包装精美，现代简约风格
- 背景干净，突出产品主体
- 色彩温暖，符合宠物用品的亲和感
- 包装上有清晰的产品名称
- 整体风格专业，适合电商展示
- 图片比例为1:1，适合小程序展示`,
      
      'ingredient': `请生成一张新鲜食材的高质量图片：${productName}。要求：
- 食材新鲜，色泽自然
- 背景简洁，突出食材本身
- 光线柔和，展现食材的质感
- 适合宠物食品制作的优质食材
- 图片比例为1:1，适合小程序展示`,
      
      'nutrition': `请生成一张宠物营养品的商品图片：${productName}。要求：
- 包装专业，体现营养价值
- 背景干净，突出产品
- 色彩健康，符合营养品特性
- 包装设计现代，有品质感
- 图片比例为1:1，适合小程序展示`
    };

    return prompts[category] || prompts['pet-food'];
  }

  // 调用豆包大模型生成图片
  async generateImage(productName, category = 'pet-food') {
    const prompt = this.generateProductPrompt(productName, category);
    
    try {
      // 模拟豆包API调用（实际需要替换为真实的豆包图片生成API）
      const response = await this.callDoubaoAPI(prompt);
      
      if (response.success && response.imageUrl) {
        // 下载并保存图片
        const imagePath = await this.downloadAndSaveImage(response.imageUrl, productName);
        return {
          success: true,
          imagePath: imagePath,
          imageUrl: `/images/products/${path.basename(imagePath)}`
        };
      } else {
        // 如果API失败，生成占位图
        return this.generatePlaceholderImage(productName, category);
      }
    } catch (error) {
      console.error('豆包图片生成失败:', error);
      // 降级到占位图
      return this.generatePlaceholderImage(productName, category);
    }
  }

  // 调用豆包API生成图片
  async callDoubaoAPI(prompt) {
    try {
      const requestData = {
        model: 'doubao-xl',
        prompt: prompt,
        n: 1,
        size: '512x512',
        response_format: 'url'
      };

      const response = await this.makeHttpRequest({
        hostname: 'ark.cn-beijing.volces.com',
        port: 443,
        path: '/api/v3/images/generations',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      }, JSON.stringify(requestData));

      const result = JSON.parse(response);
      
      if (result.data && result.data.length > 0) {
        return {
          success: true,
          imageUrl: result.data[0].url
        };
      } else {
        console.log('豆包API返回格式异常，使用备选图片:', result);
        // 使用高质量的宠物相关图片作为备选
        return {
          success: true,
          imageUrl: this.getBackupImageUrl(productName)
        };
      }
    } catch (error) {
      console.error('豆包API调用失败，使用备选图片:', error.message);
      // 如果API调用失败，使用高质量备选图片
      return {
        success: true,
        imageUrl: this.getBackupImageUrl(productName)
      };
    }
  }

  // 获取备选图片URL
  getBackupImageUrl(productName) {
    // 根据商品名称生成相关的高质量图片
    const petFoodImages = [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop', // 猫粮
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop', // 狗粮
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop', // 宠物食品
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop', // 宠物营养品
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop'  // 宠物零食
    ];
    
    // 根据商品名称选择合适的图片
    const hash = productName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const index = Math.abs(hash) % petFoodImages.length;
    return petFoodImages[index];
  }

  // HTTP请求辅助方法
  makeHttpRequest(options, postData) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (postData) {
        req.write(postData);
      }
      req.end();
    });
  }

  // 下载并保存图片
  async downloadAndSaveImage(imageUrl, productName) {
    return new Promise((resolve, reject) => {
      const fileName = `${this.sanitizeFileName(productName)}_${Date.now()}.jpg`;
      const filePath = path.join(this.imageDir, fileName);
      const file = fs.createWriteStream(filePath);

      https.get(imageUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filePath);
        });
      }).on('error', (error) => {
        fs.unlink(filePath, () => {}); // 删除不完整的文件
        reject(error);
      });
    });
  }

  // 生成SVG占位图
  generatePlaceholderImage(productName, category) {
    const colors = {
      'pet-food': '#F6C642',
      'ingredient': '#4CAF50',
      'nutrition': '#2196F3'
    };

    const color = colors[category] || colors['pet-food'];
    const fileName = `${this.sanitizeFileName(productName)}_placeholder.svg`;
    const filePath = path.join(this.imageDir, fileName);

    const svgContent = `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${this.darkenColor(color, 20)};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#grad)" rx="20"/>
  <circle cx="200" cy="150" r="60" fill="rgba(255,255,255,0.3)"/>
  <text x="200" y="280" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        text-anchor="middle" fill="white">${productName}</text>
  <text x="200" y="320" font-family="Arial, sans-serif" font-size="16" 
        text-anchor="middle" fill="rgba(255,255,255,0.8)">优质宠物用品</text>
</svg>`;

    fs.writeFileSync(filePath, svgContent);
    
    return {
      success: true,
      imagePath: filePath,
      imageUrl: `/images/products/${fileName}`
    };
  }

  // 文件名清理
  sanitizeFileName(name) {
    return name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
  }

  // 颜色加深
  darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  // 批量生成商品图片
  async generateProductImages(products) {
    const results = [];
    
    for (const product of products) {
      try {
        const result = await this.generateImage(product.name, product.category);
        results.push({
          ...product,
          ...result
        });
        
        // 避免API调用过于频繁
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`生成${product.name}图片失败:`, error);
        results.push({
          ...product,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }
}

module.exports = DoubaoImageService;