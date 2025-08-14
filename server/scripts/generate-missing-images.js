#!/usr/bin/env node

/**
 * 生成缺失的图片脚本
 * 专门生成那两个占位符图片
 */

const axios = require('axios');
const path = require('path');
const RealImageService = require('../services/realImageService');

// 加载环境变量
require('dotenv').config();

// 直接使用服务生成图片
async function generateMissingImages() {
  console.log('🎨 生成缺失的食谱图片...');
  
  const imageService = new RealImageService();
  
  // 需要重新生成的两张图片
  const missingImages = [
    {
      key: 'recipe.chicken_veggie_bowl',
      prompt: 'Chicken and vegetable bowl, lean chicken breast with fresh broccoli, carrots and herbs, arranged in modern pet bowl, soft lighting, sensitive stomach friendly meal',
      category: 'recipes',
      size: '1024x1024',
      style: 'realistic'
    },
    {
      key: 'recipe.tuna_surprise',
      prompt: 'Tuna surprise with sweet potato, fresh tuna chunks with roasted sweet potato cubes, arranged on slate plate, natural lighting, protein-rich pet treat',
      category: 'recipes',
      size: '1024x1024',
      style: 'realistic'
    }
  ];
  
  console.log(`📸 准备生成 ${missingImages.length} 张缺失的图片...`);
  
  const results = [];
  for (let i = 0; i < missingImages.length; i++) {
    const image = missingImages[i];
    console.log(`\n🎨 [${i + 1}/${missingImages.length}] 生成: ${image.key}`);
    console.log(`📝 提示词: ${image.prompt}`);
    
    try {
      const result = await imageService.generateImage(image.prompt, {
        category: image.category,
        size: image.size,
        style: image.style,
        service: 'stability' // 使用Stability AI
      });
      
      results.push({
        key: image.key,
        ...result
      });
      
      if (result.success) {
        console.log(`✅ 生成成功: ${result.localPath}`);
      } else {
        console.log(`⚠️  使用占位符: ${result.localPath}`);
      }
      
    } catch (error) {
      console.error(`❌ 生成失败: ${error.message}`);
      results.push({
        key: image.key,
        success: false,
        error: error.message
      });
    }
    
    // 添加延迟避免API限制
    if (i < missingImages.length - 1) {
      console.log('⏳ 等待 2 秒...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n==================================================');
  console.log('🎉 缺失图片生成完成！');
  console.log(`📊 统计信息:`);
  console.log(`   - 总数: ${results.length}`);
  console.log(`   - 成功生成: ${results.filter(r => r.success).length}`);
  console.log(`   - 占位符: ${results.filter(r => !r.success).length}`);
  
  const successResults = results.filter(r => r.success);
  if (successResults.length > 0) {
    console.log('\n✅ 成功生成的图片:');
    successResults.forEach(result => {
      console.log(`   📸 ${result.key}: ${result.localPath}`);
    });
  }
  
  const failedResults = results.filter(r => !r.success);
  if (failedResults.length > 0) {
    console.log('\n⚠️  占位符图片:');
    failedResults.forEach(result => {
      console.log(`   🖼️  ${result.key}: ${result.localPath || result.error}`);
    });
  }
  
  console.log('\n🎯 生成完成！图片已保存到:');
  console.log('   📁 /server/public/images/ai-generated/');
  console.log('\n🌐 可通过以下URL访问:');
  console.log('   🔗 http://localhost:3000/images/ai-generated/');
  
  return results;
}

async function main() {
  try {
    await generateMissingImages();
    process.exit(0);
  } catch (error) {
    console.error('❌ 脚本执行失败:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ 未处理的错误:', error);
    process.exit(1);
  });
}

module.exports = {
  generateMissingImages,
  main
};