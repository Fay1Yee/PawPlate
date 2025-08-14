const express = require('express');
const router = express.Router();
const RealImageService = require('../services/realImageService');
const fs = require('fs').promises;
const path = require('path');

const imageService = new RealImageService();

// 小程序所需的图片配置
const miniappImageJobs = [
  // 商品图片
  {
    key: 'product.adult_cat_food',
    prompt: '高品质成年猫粮包装袋，现代简约设计，温暖的橙黄色调，包装上有可爱的猫咪图案，产品居中展示，干净的白色背景',
    category: 'products',
    size: '512x512',
    style: 'realistic'
  },
  {
    key: 'product.cat_treats',
    prompt: '猫咪零食包装盒，精美设计，暖黄色包装，上面有猫咪图案和零食图片，产品居中展示，简洁背景',
    category: 'products',
    size: '512x512',
    style: 'realistic'
  },
  {
    key: 'product.cat_nutrition_paste',
    prompt: '猫咪营养膏包装管，专业医疗级设计，蓝白色调，产品居中展示，干净背景',
    category: 'products',
    size: '512x512',
    style: 'realistic'
  },
  {
    key: 'product.cat_vitamins',
    prompt: '猫咪维生素瓶装，透明瓶身，彩色标签，健康绿色调，产品居中展示，白色背景',
    category: 'products',
    size: '512x512',
    style: 'realistic'
  },
  
  // 食谱图片
  {
    key: 'recipe.chicken_pumpkin',
    prompt: '鸡肉南瓜宠物餐，新鲜鸡胸肉和南瓜块，摆放在木质托盘上，温暖的自然光线，俯视角度',
    category: 'recipes',
    size: '750x420',
    style: 'realistic'
  },
  {
    key: 'recipe.salmon_vegetables',
    prompt: '三文鱼蔬菜宠物餐，新鲜三文鱼片配胡萝卜和西兰花，摆放在白色盘子里，自然光线，俯视角度',
    category: 'recipes',
    size: '750x420',
    style: 'realistic'
  },
  {
    key: 'recipe.beef_potato',
    prompt: '牛肉土豆宠物餐，切块的牛肉和土豆，摆放在陶瓷碗中，温暖光线，俯视角度',
    category: 'recipes',
    size: '750x420',
    style: 'realistic'
  },
  
  // 英雄图片
  {
    key: 'hero.home_cat',
    prompt: '可爱的橘猫坐在现代厨房里，旁边有精美的宠物食盆，温暖的黄色调，柔和光线，温馨家庭氛围',
    category: 'heroes',
    size: '1125x420',
    style: 'cartoon'
  },
  {
    key: 'hero.home_dog',
    prompt: '可爱的金毛犬坐在现代厨房里，旁边有精美的宠物食盆，温暖的黄色调，柔和光线，温馨家庭氛围',
    category: 'heroes',
    size: '1125x420',
    style: 'cartoon'
  },
  
  // 图标
  {
    key: 'icon.profile',
    prompt: '宠物档案图标，简约现代设计，圆形背景，温暖黄色调，毛玻璃效果',
    category: 'icons',
    size: '128x128',
    style: 'glassmorphism'
  },
  {
    key: 'icon.ai_custom',
    prompt: 'AI定制图标，机器人头像，简约现代设计，圆形背景，温暖黄色调，毛玻璃效果',
    category: 'icons',
    size: '128x128',
    style: 'glassmorphism'
  },
  {
    key: 'icon.purchase',
    prompt: '购物车图标，简约现代设计，圆形背景，温暖黄色调，毛玻璃效果',
    category: 'icons',
    size: '128x128',
    style: 'glassmorphism'
  }
];

// 生成单张图片
router.post('/generate', async (req, res) => {
  try {
    const { prompt, category = 'products', size = '512x512', style = 'cartoon', service = 'stability' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: '缺少prompt参数'
      });
    }
    
    console.log(`🎨 收到图片生成请求: ${prompt}`);
    
    const result = await imageService.generateImage(prompt, {
      category,
      size,
      style,
      service
    });
    
    res.json(result);
  } catch (error) {
    console.error('图片生成错误:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 批量生成小程序所需图片
router.post('/generate-miniapp', async (req, res) => {
  try {
    console.log('🚀 开始生成小程序所需图片...');
    
    const results = await imageService.batchGenerate(miniappImageJobs);
    
    // 保存生成结果到manifest文件
    const manifestPath = path.join(__dirname, '../public/images/ai-generated/miniapp-manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(results, null, 2));
    
    const successCount = results.filter(r => r.success).length;
    
    res.json({
      success: true,
      message: `小程序图片生成完成！成功: ${successCount}/${results.length}`,
      results,
      manifestPath: '/images/ai-generated/miniapp-manifest.json'
    });
  } catch (error) {
    console.error('批量生成错误:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取生成状态
router.get('/status', (req, res) => {
  res.json({
    success: true,
    services: {
      stability: !!process.env.STABILITY_API_KEY,
      doubao: !!process.env.DOUBAO_API_KEY,
      openai: !!process.env.OPENAI_API_KEY
    },
    message: 'AI图片生成服务运行正常'
  });
});

// 获取已生成的图片列表
router.get('/list/:category?', async (req, res) => {
  try {
    const { category } = req.params;
    const baseDir = path.join(__dirname, '../public/images/ai-generated');
    
    let targetDir = baseDir;
    if (category) {
      targetDir = path.join(baseDir, category);
    }
    
    const files = await fs.readdir(targetDir, { withFileTypes: true });
    const images = [];
    
    for (const file of files) {
      if (file.isFile() && /\.(png|jpg|jpeg|webp|svg)$/i.test(file.name)) {
        const relativePath = category 
          ? `/images/ai-generated/${category}/${file.name}`
          : `/images/ai-generated/${file.name}`;
        images.push({
          name: file.name,
          path: relativePath,
          category: category || 'root'
        });
      }
    }
    
    res.json({
      success: true,
      category: category || 'all',
      count: images.length,
      images
    });
  } catch (error) {
    console.error('获取图片列表错误:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 删除生成的图片
router.delete('/delete/:category/:filename', async (req, res) => {
  try {
    const { category, filename } = req.params;
    const filePath = path.join(__dirname, '../public/images/ai-generated', category, filename);
    
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: `图片 ${filename} 已删除`
    });
  } catch (error) {
    console.error('删除图片错误:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;