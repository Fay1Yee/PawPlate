const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// 模拟豆包API调用（实际项目中需要替换为真实的豆包API）
class DoubaoImageGenerator {
  constructor() {
    this.basePrompt = {
      zh: '卡通毛玻璃风格插画，暖黄色主色，柔和体积光，圆角大卡片与玻璃高光，细腻颗粒点缀，背景简洁留白或浅黄渐变，无文字，无水印，高分辨率',
      en: 'Cartoon glassmorphism illustration, warm yellow primary, soft volumetric light, rounded shapes with frosted gloss, subtle grain specks, minimal background, no text, high-resolution'
    };
    
    this.negativePrompt = 'photorealistic, harsh contrast, text, watermark, logo clutter, metallic reflections, noisy background';
  }

  async generateImage(prompt, options = {}) {
    const {
      size = '750x420',
      format = 'webp',
      seed = 'pawplate_v1',
      cfg = 8,
      steps = 35
    } = options;

    // 构建完整提示词
    const fullPrompt = `${this.basePrompt.zh}, ${prompt}`;
    
    console.log('生成图片参数:', {
      prompt: fullPrompt,
      negative: this.negativePrompt,
      size,
      format,
      seed,
      cfg,
      steps
    });

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模拟生成结果（演示用）
    // 在实际部署时，这里应该调用真实的豆包API
    const mockImageUrl = `https://cdn.pawplate.com/generated/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${format}`;
    
    console.log('图片生成成功:', mockImageUrl);
    
    return {
      success: true,
      url: mockImageUrl,
      cached: false,
      generated: true,
      metadata: {
        prompt: fullPrompt,
        size,
        format,
        seed,
        generatedAt: new Date().toISOString()
      }
    };
  }
}

const imageGenerator = new DoubaoImageGenerator();

// 图片提示词模板
const promptTemplates = {
  hero: {
    home_cat: '可爱猫咪与玻璃态食盆，暖黄渐变背景，轻微光斑，扁平+2.5D融合风，画面中央右偏，留出左侧文案空间',
    home_dog: '可爱狗狗与玻璃态食盆，暖黄渐变背景，轻微光斑，扁平+2.5D融合风，画面中央右偏，留出左侧文案空间',
    home_general: '可爱宠物与玻璃态食盆，暖黄渐变背景，轻微光斑，扁平+2.5D融合风，画面中央右偏，留出左侧文案空间',
    chat: 'AI聊天助手场景，温暖对话氛围，黄系毛玻璃界面元素，居中构图'
  },
  icons: {
    profile: '档案记录的卡通图标，单一主体，黄系玻璃质感，透明背景PNG',
    history: '历史记录的卡通图标，单一主体，黄系玻璃质感，透明背景PNG',
    faq: 'FAQ帮助的卡通图标，单一主体，黄系玻璃质感，透明背景PNG',
    ai_custom: 'AI定制的卡通图标，单一主体，黄系玻璃质感，透明背景PNG',
    purchase: '购买商城的卡通图标，单一主体，黄系玻璃质感，透明背景PNG',
    activity: '活动优惠的卡通图标，单一主体，黄系玻璃质感，透明背景PNG'
  },
  recipes: {
    default: '宠物家常自制餐食，食材展示，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色'
  },
  stickers: {
    default: '食材贴纸，单一主体，黄系玻璃质感，透明背景PNG'
  },
  empty_states: {
    no_network: '无网络连接的空状态插画，简单场景，温暖治愈不焦虑，居中构图',
    no_recommendations: '暂无推荐的空状态插画，简单场景，温暖治愈不焦虑，居中构图',
    no_favorites: '无收藏内容的空状态插画，简单场景，温暖治愈不焦虑，居中构图'
  }
};

// 获取提示词模板
function getPromptTemplate(key) {
  const [category, name] = key.split('.');
  
  if (promptTemplates[category] && promptTemplates[category][name]) {
    return promptTemplates[category][name];
  }
  
  if (promptTemplates[category] && promptTemplates[category].default) {
    return promptTemplates[category].default;
  }
  
  return '暖黄色毛玻璃风格插画，简洁美观';
}

// 更新manifest文件
async function updateManifest(key, url) {
  try {
    const manifestPath = path.join(__dirname, '../../miniapp/assets/images/manifest.json');
    const manifestData = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestData);
    
    const [category, name] = key.split('.');
    if (!manifest[category]) {
      manifest[category] = {};
    }
    
    manifest[category][name] = url;
    
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`Manifest updated: ${key} -> ${url}`);
  } catch (error) {
    console.error('更新manifest失败:', error);
  }
}

// 单张图片生成API
router.post('/', async (req, res) => {
  try {
    const { key, prompt, size, format, seed } = req.body;
    
    if (!key && !prompt) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数: key 或 prompt'
      });
    }
    
    // 使用提供的prompt或从模板获取
    const finalPrompt = prompt || getPromptTemplate(key);
    
    const result = await imageGenerator.generateImage(finalPrompt, {
      size: size || '750x420',
      format: format || 'webp',
      seed: seed || 'pawplate_v1'
    });
    
    if (result.success && key) {
      // 更新manifest
      await updateManifest(key, result.url);
    }
    
    res.json({
      success: true,
      url: result.url,
      key: key,
      metadata: result.metadata
    });
    
  } catch (error) {
    console.error('图片生成失败:', error);
    res.status(500).json({
      success: false,
      error: '图片生成失败',
      details: error.message
    });
  }
});

// 状态检查接口
router.get('/status', (req, res) => {
  res.json({
    success: true,
    version: '1.0.0',
    service: 'PawPlate Image Generation API',
    timestamp: new Date().toISOString()
  });
});

// 批量生成图片接口
router.post('/batch', async (req, res) => {
  try {
    const { jobs, style_seed = 'pawplate_v1' } = req.body;
    
    if (!jobs || !Array.isArray(jobs)) {
      return res.status(400).json({
        success: false,
        error: '缺少jobs参数或格式错误'
      });
    }
    
    const results = [];
    const errors = [];
    
    // 并发生成（限制并发数避免过载）
    const concurrency = 3;
    for (let i = 0; i < jobs.length; i += concurrency) {
      const batch = jobs.slice(i, i + concurrency);
      
      const batchPromises = batch.map(async (job) => {
        try {
          const { key, prompt, size, format } = job;
          
          // 检查是否已存在
          const manifestPath = path.join(__dirname, '../../miniapp/assets/images/manifest.json');
          try {
            const manifestData = await fs.readFile(manifestPath, 'utf8');
            const manifest = JSON.parse(manifestData);
            const [category, name] = key.split('.');
            
            if (manifest[category] && manifest[category][name]) {
              console.log(`图片 ${key} 已存在，跳过生成`);
              return {
                key,
                url: manifest[category][name],
                status: 'cached'
              };
            }
          } catch (e) {
            // manifest文件不存在或解析失败，继续生成
          }
          
          const finalPrompt = prompt || getPromptTemplate(key);
          
          const result = await imageGenerator.generateImage(finalPrompt, {
            size: size || '750x420',
            format: format || 'webp',
            seed: style_seed
          });
          
          if (result.success) {
            await updateManifest(key, result.url);
            return {
              key,
              url: result.url,
              status: 'generated',
              metadata: result.metadata
            };
          } else {
            throw new Error('生成失败');
          }
          
        } catch (error) {
          console.error(`生成图片 ${job.key} 失败:`, error);
          return {
            key: job.key,
            error: error.message,
            status: 'failed'
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      
      batchResults.forEach(result => {
        if (result.error) {
          errors.push(result);
        } else {
          results.push(result);
        }
      });
      
      // 批次间延迟，避免API限流
      if (i + concurrency < jobs.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    res.json({
      success: true,
      total: jobs.length,
      generated: results.filter(r => r.status === 'generated').length,
      cached: results.filter(r => r.status === 'cached').length,
      failed: errors.length,
      results,
      errors
    });
    
  } catch (error) {
    console.error('批量生成失败:', error);
    res.status(500).json({
      success: false,
      error: '批量生成失败',
      details: error.message
    });
  }
});

// 获取生成状态API
router.get('/status', (req, res) => {
  res.json({
    success: true,
    service: 'PawPlate Image Generation',
    version: '1.0.0',
    templates: Object.keys(promptTemplates),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;