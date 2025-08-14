const path = require('path');
const RealImageService = require('../services/realImageService');

// 加载环境变量
require('dotenv').config();

// 初始化图片生成服务
const imageService = new RealImageService();

// 缺失的食谱图片配置
const missingRecipeImages = [
  {
    key: 'recipe.chicken_veggie_bowl',
    prompt: 'Chicken and vegetable bowl, lean chicken breast with fresh broccoli, carrots and herbs, arranged in modern pet bowl, soft lighting, sensitive stomach friendly meal',
    category: 'recipes',
    size: '1024x1024',
    style: 'realistic',
    service: 'doubao' // 使用豆包服务
  },
  {
    key: 'recipe.tuna_surprise',
    prompt: 'Tuna surprise with sweet potato, fresh tuna chunks with roasted sweet potato cubes, arranged on slate plate, natural lighting, protein-rich pet treat',
    category: 'recipes',
    size: '1024x1024',
    style: 'realistic',
    service: 'doubao' // 使用豆包服务
  }
];

async function generateMissingImages() {
  console.log('🎨 使用OpenAI生成缺失的食谱图片...');
  console.log(`📸 准备生成 ${missingRecipeImages.length} 张缺失的图片...\n`);
  
  const results = [];
  let successCount = 0;
  let placeholderCount = 0;
  
  for (let i = 0; i < missingRecipeImages.length; i++) {
    const imageConfig = missingRecipeImages[i];
    console.log(`🎨 [${i + 1}/${missingRecipeImages.length}] 生成: ${imageConfig.key}`);
    console.log(`📝 提示词: ${imageConfig.prompt}`);
    
    try {
      const result = await imageService.generateImage(imageConfig.prompt, {
        category: imageConfig.category,
        size: imageConfig.size,
        style: imageConfig.style,
        service: imageConfig.service
      });
      
      if (result.success) {
        console.log(`✅ 成功生成: ${result.fileName}`);
        successCount++;
      } else {
        console.log(`⚠️  使用占位符: ${result.localPath}`);
        placeholderCount++;
      }
      
      results.push({
        key: imageConfig.key,
        ...result
      });
      
    } catch (error) {
      console.error(`❌ 生成失败: ${error.message}`);
      placeholderCount++;
      results.push({
        key: imageConfig.key,
        success: false,
        error: error.message
      });
    }
    
    // 添加延迟避免速率限制
    if (i < missingRecipeImages.length - 1) {
      console.log('⏳ 等待 3 秒...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    console.log('');
  }
  
  // 输出统计信息
  console.log('==================================================');
  console.log('🎉 缺失图片生成完成！');
  console.log('📊 统计信息:');
  console.log(`   - 总数: ${results.length}`);
  console.log(`   - 成功生成: ${successCount}`);
  console.log(`   - 占位符: ${placeholderCount}`);
  
  if (placeholderCount > 0) {
    console.log('\n⚠️  占位符图片:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`   🖼️  ${result.key}: ${result.localPath || result.placeholderPath}`);
    });
  }
  
  if (successCount > 0) {
    console.log('\n✅ 成功生成的图片:');
    results.filter(r => r.success).forEach(result => {
      console.log(`   🖼️  ${result.key}: ${result.localPath}`);
    });
  }
  
  console.log('\n🎯 生成完成！图片已保存到:');
  console.log('   📁 /server/public/images/ai-generated/');
  console.log('\n🌐 可通过以下URL访问:');
  console.log('   🔗 http://localhost:3000/images/ai-generated/');
  
  return results;
}

// 运行生成任务
if (require.main === module) {
  generateMissingImages()
    .then(results => {
      console.log('\n🎊 任务完成！');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ 任务失败:', error);
      process.exit(1);
    });
}

module.exports = { generateMissingImages };