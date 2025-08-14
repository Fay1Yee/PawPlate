#!/usr/bin/env node

/**
 * 小程序图片生成脚本
 * 为小程序生成所需的AI图片
 */

const axios = require('axios');
const path = require('path');
const RealImageService = require('../services/realImageService');

// 加载环境变量
require('dotenv').config();

// 服务器配置
const SERVER_URL = 'http://localhost:3000';
const API_ENDPOINT = `${SERVER_URL}/api/real-genimage/generate-miniapp`;

// 直接使用服务生成图片（不依赖API）
async function generateDirectly() {
  console.log('🎨 直接使用服务生成小程序图片...');
  
  const imageService = new RealImageService();
  
  // 小程序关键图片 - English prompts for better AI generation
  const miniappImages = [
    {
      key: 'product.adult_cat_food',
      prompt: 'Premium adult cat food packaging bag, modern minimalist design, warm orange-yellow color scheme, cute cat illustration on package, product centered, clean white background, professional product photography',
      category: 'products',
      size: '1024x1024',
      style: 'realistic'
    },
    {
      key: 'product.cat_treats',
      prompt: 'Luxury cat treats packaging box, elegant design, warm yellow packaging with cat silhouette and treat images, product centered, premium pet food branding',
      category: 'products', 
      size: '1024x1024', 
      style: 'realistic'
    },
    {
      key: 'product.cat_nutrition_paste',
      prompt: 'Cat nutrition paste tube, professional veterinary-grade design, blue and white color scheme, medical-style packaging, product centered, health supplement branding',
      category: 'products',
      size: '1024x1024', 
      style: 'realistic'
    },
    {
      key: 'product.cat_vitamins',
      prompt: 'Cat vitamin supplement bottle, transparent container with colorful label, healthy green color theme, product centered, pharmaceutical-style packaging',
      category: 'products',
      size: '1024x1024',
      style: 'realistic'
    },
    {
      key: 'hero.home_cat',
      prompt: 'Adorable orange tabby cat sitting in modern kitchen, elegant pet food bowls nearby, warm yellow lighting, soft ambient light, cozy home atmosphere, cartoon style illustration',
      category: 'heroes',
      size: '1024x1024',
      style: 'cartoon'
    },
    {
      key: 'hero.home_dog', 
      prompt: 'Cute golden retriever sitting in modern kitchen, elegant pet food bowls nearby, warm yellow lighting, soft ambient light, cozy home atmosphere, cartoon style illustration',
      category: 'heroes',
      size: '1024x1024',
      style: 'cartoon'
    },
    {
      key: 'recipe.healthy_cat_meal',
      prompt: 'Healthy chicken and rice cat meal, fresh chicken breast with steamed rice and mixed vegetables, arranged on wooden tray, warm natural lighting, top-down view, nutritious pet food photography',
      category: 'recipes',
      size: '1024x1024',
      style: 'realistic'
    },
    {
      key: 'recipe.salmon_delight',
      prompt: 'Fresh salmon delight with quinoa and carrots, grilled salmon fillet with quinoa and orange carrots, arranged on white ceramic plate, natural lighting, top-down view, omega-3 rich pet meal',
      category: 'recipes',
      size: '1024x1024', 
      style: 'realistic'
    },
    {
      key: 'recipe.nutritious_cat_food',
      prompt: 'Nutritious fish and sweet potato meal, white fish fillet with roasted sweet potato and fresh spinach leaves, arranged on rustic wooden board, natural lighting, healthy pet nutrition',
      category: 'recipes',
      size: '1024x1024',
      style: 'realistic'
    },
    {
      key: 'recipe.turkey_feast',
      prompt: 'Turkey feast with brown rice and peas, lean turkey breast with brown rice and green peas, arranged on ceramic bowl, warm lighting, digestive health pet meal',
      category: 'recipes',
      size: '1024x1024',
      style: 'realistic'
    },
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
  
  console.log(`📸 准备生成 ${miniappImages.length} 张图片...`);
  
  const results = [];
  for (let i = 0; i < miniappImages.length; i++) {
    const image = miniappImages[i];
    console.log(`\n🎨 [${i + 1}/${miniappImages.length}] 生成: ${image.key}`);
    console.log(`📝 提示词: ${image.prompt}`);
    
    try {
      const result = await imageService.generateImage(image.prompt, {
        category: image.category,
        size: image.size,
        style: image.style,
        service: 'stability' // 默认使用Stability AI，如果没有API密钥会生成占位符
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
    if (i < miniappImages.length - 1) {
      console.log('⏳ 等待 2 秒...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // 统计结果
  const successCount = results.filter(r => r.success).length;
  const placeholderCount = results.filter(r => !r.success).length;
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 小程序图片生成完成！');
  console.log(`📊 统计信息:`);
  console.log(`   - 总数: ${results.length}`);
  console.log(`   - 成功生成: ${successCount}`);
  console.log(`   - 占位符: ${placeholderCount}`);
  
  if (successCount > 0) {
    console.log('\n✅ 成功生成的图片:');
    results.filter(r => r.success).forEach(r => {
      console.log(`   📸 ${r.key}: ${r.localPath}`);
    });
  }
  
  if (placeholderCount > 0) {
    console.log('\n⚠️  占位符图片:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   🖼️  ${r.key}: ${r.localPath || '生成失败'}`);
    });
    console.log('\n💡 提示: 配置真实的API密钥可生成AI图片');
    console.log('   - 复制 .env.example 为 .env');
    console.log('   - 填入 STABILITY_API_KEY 或其他API密钥');
  }
  
  return results;
}

// 通过API生成图片
async function generateViaAPI() {
  console.log('🌐 通过API生成小程序图片...');
  
  try {
    const response = await axios.post(API_ENDPOINT, {}, {
      timeout: 300000 // 5分钟超时
    });
    
    if (response.data.success) {
      console.log('✅ API生成成功!');
      console.log(response.data.message);
      return response.data.results;
    } else {
      throw new Error(response.data.error || 'API返回失败');
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ 服务器未启动，切换到直接生成模式...');
      return await generateDirectly();
    }
    throw error;
  }
}

// 检查服务器状态
async function checkServerStatus() {
  try {
    const response = await axios.get(`${SERVER_URL}/api/real-genimage/status`, {
      timeout: 5000
    });
    
    console.log('✅ 服务器连接正常');
    console.log('🔑 API密钥状态:', response.data.services);
    return true;
  } catch (error) {
    console.log('❌ 服务器连接失败，将使用直接生成模式');
    return false;
  }
}

// 主函数
async function main() {
  console.log('🚀 PawPlate 小程序图片生成工具');
  console.log('=' .repeat(50));
  
  try {
    // 直接使用服务生成，避免API路由问题
    console.log('🎨 使用直接服务生成模式...');
    const results = await generateDirectly();
    
    console.log('\n🎯 生成完成！图片已保存到:');
    console.log('   📁 /server/public/images/ai-generated/');
    console.log('\n🌐 可通过以下URL访问:');
    console.log(`   🔗 ${SERVER_URL}/images/ai-generated/`);
    
  } catch (error) {
    console.error('❌ 生成失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(error => {
    console.error('💥 脚本执行失败:', error.message);
    process.exit(1);
  });
}

module.exports = {
  generateDirectly,
  generateViaAPI,
  main
};