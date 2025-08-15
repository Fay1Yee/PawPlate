const path = require('path');
const RealImageService = require('../services/realImageService');
const fs = require('fs').promises;

// 加载环境变量
require('dotenv').config();

// 初始化图片生成服务
const imageService = new RealImageService();

// Profile页面收藏菜谱图片配置
const profileRecipeImages = [
  {
    key: 'pumpkin_chicken_porridge',
    fileName: 'pumpkin_chicken_porridge.jpg',
    prompt: 'Pumpkin chicken porridge for cats, appetizing pet food photography, tender chicken pieces mixed with creamy pumpkin puree in a modern ceramic pet bowl, garnished with fresh herbs, warm natural lighting, high-quality food styling, realistic texture',
    category: 'recipes',
    size: '1024x1024',
    style: 'realistic',
    service: 'doubao'
  },
  {
    key: 'salmon_avocado_bowl',
    fileName: 'salmon_avocado_bowl.jpg',
    prompt: 'Salmon avocado bowl for pets, professional food photography, fresh salmon chunks with diced avocado and vegetables arranged in elegant pet bowl, vibrant colors, natural lighting, appetizing presentation, realistic style',
    category: 'recipes',
    size: '1024x1024',
    style: 'realistic',
    service: 'doubao'
  },
  {
    key: 'chicken_pumpkin_bowl',
    fileName: 'chicken-pumpkin-bowl.jpg',
    prompt: 'Chicken pumpkin bowl for pets, detailed food photography, grilled chicken pieces with roasted pumpkin chunks and vegetables in modern pet bowl, warm golden lighting, nutritious and colorful presentation, realistic texture',
    category: 'recipes',
    size: '1024x1024',
    style: 'realistic',
    service: 'doubao'
  },
  {
    key: 'beef_vegetable_stew',
    fileName: 'beef-vegetable-stew.jpg',
    prompt: 'Beef vegetable stew for pets, hearty pet food photography, tender beef chunks with mixed vegetables including carrots, peas and potatoes in rustic ceramic bowl, rich colors, natural lighting, homemade appearance, realistic style',
    category: 'recipes',
    size: '1024x1024',
    style: 'realistic',
    service: 'doubao'
  }
];

// 检查图片是否存在且有效
async function checkImageExists(fileName) {
  const imagePath = path.join(__dirname, '../../miniapp/images/recipes', fileName);
  try {
    await fs.access(imagePath);
    // 检查文件大小，如果太小可能是损坏的
    const stats = await fs.stat(imagePath);
    return stats.size > 10000; // 至少10KB
  } catch {
    return false;
  }
}

// 生成Profile页面收藏菜谱图片
async function generateProfileRecipeImages() {
  console.log('🍽️ 开始检查Profile页面收藏菜谱图片...');
  console.log(`总共需要检查 ${profileRecipeImages.length} 张图片\n`);
  
  let successCount = 0;
  let failureCount = 0;
  let skippedCount = 0;
  
  for (let i = 0; i < profileRecipeImages.length; i++) {
    const config = profileRecipeImages[i];
    console.log(`\n[${i + 1}/${profileRecipeImages.length}] 检查: ${config.fileName}`);
    
    // 检查图片是否已存在
    const exists = await checkImageExists(config.fileName);
    if (exists) {
      console.log(`✅ 图片已存在，跳过生成: ${config.fileName}`);
      skippedCount++;
      continue;
    }
    
    console.log(`🎨 图片不存在，开始生成: ${config.key}`);
    console.log(`📝 提示词: ${config.prompt.substring(0, 100)}...`);
    
    try {
      const result = await imageService.generateImage(config.prompt, {
        category: config.category,
        size: config.size,
        style: config.style,
        service: config.service
      });
      
      if (result.success) {
        // 将生成的图片复制到miniapp的recipes目录
        const sourcePath = path.join(__dirname, '../public', result.localPath);
        const targetPath = path.join(__dirname, '../../miniapp/images/recipes', config.fileName);
        
        try {
          await fs.copyFile(sourcePath, targetPath);
          console.log(`✅ 图片已复制到: ${targetPath}`);
          successCount++;
        } catch (copyError) {
          console.error(`❌ 复制图片失败: ${copyError.message}`);
          failureCount++;
        }
      } else {
        console.error(`❌ 生成失败: ${config.key}`);
        failureCount++;
      }
    } catch (error) {
      console.error(`❌ 生成图片时出错: ${error.message}`);
      failureCount++;
    }
    
    // 添加延迟避免API限制
    if (i < profileRecipeImages.length - 1) {
      console.log('⏳ 等待3秒...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n📊 生成结果统计:');
  console.log(`成功: ${successCount}/${profileRecipeImages.length}`);
  console.log(`失败: ${failureCount}/${profileRecipeImages.length}`);
  console.log(`跳过: ${skippedCount}/${profileRecipeImages.length}`);
}

// 如果直接运行此脚本
if (require.main === module) {
  generateProfileRecipeImages()
    .then(() => {
      console.log('\n🎉 Profile页面收藏菜谱图片生成完成!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ 生成过程中出现错误:', error);
      process.exit(1);
    });
}

module.exports = { generateProfileRecipeImages };