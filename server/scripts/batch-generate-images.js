#!/usr/bin/env node

/**
 * 批量生成图片脚本
 * 用于一次性生成项目所需的基础图片集
 */

const axios = require('axios');
const path = require('path');

// 服务器配置
const SERVER_URL = 'http://localhost:3000';
const BATCH_API = `${SERVER_URL}/api/genimage/batch`;

// 基础图片生成任务
const imageJobs = [
  // Hero 图片 (3张)
  {
    key: 'hero.home_cat',
    prompt: '可爱猫咪与玻璃态食盆，暖黄渐变背景，轻微光斑，扁平+2.5D融合风，画面中央右偏，留出左侧文案空间',
    size: '1125x420',
    format: 'webp'
  },
  {
    key: 'hero.home_dog',
    prompt: '可爱狗狗与玻璃态食盆，暖黄渐变背景，轻微光斑，扁平+2.5D融合风，画面中央右偏，留出左侧文案空间',
    size: '1125x420',
    format: 'webp'
  },
  {
    key: 'hero.chat',
    prompt: 'AI聊天助手场景，温暖对话氛围，黄系毛玻璃界面元素，居中构图',
    size: '750x420',
    format: 'webp'
  },

  // 快捷卡图标 (6张)
  {
    key: 'icons.profile',
    prompt: '档案记录的卡通图标，单一主体，黄系玻璃质感，透明背景PNG',
    size: '128x128',
    format: 'png'
  },
  {
    key: 'icons.history',
    prompt: '历史记录的卡通图标，单一主体，黄系玻璃质感，透明背景PNG',
    size: '128x128',
    format: 'png'
  },
  {
    key: 'icons.faq',
    prompt: 'FAQ帮助的卡通图标，单一主体，黄系玻璃质感，透明背景PNG',
    size: '128x128',
    format: 'png'
  },
  {
    key: 'icons.ai_custom',
    prompt: 'AI定制的卡通图标，单一主体，黄系玻璃质感，透明背景PNG',
    size: '128x128',
    format: 'png'
  },
  {
    key: 'icons.purchase',
    prompt: '购买商城的卡通图标，单一主体，黄系玻璃质感，透明背景PNG',
    size: '128x128',
    format: 'png'
  },
  {
    key: 'icons.activity',
    prompt: '活动优惠的卡通图标，单一主体，黄系玻璃质感，透明背景PNG',
    size: '128x128',
    format: 'png'
  },

  // 菜谱封面图 (12张)
  {
    key: 'recipes.cat_001',
    prompt: '猫咪家常自制宠物餐：南瓜鸡肉粥，食材展示：鸡胸肉、南瓜、猫用营养粉，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色',
    size: '750x420',
    format: 'webp'
  },
  {
    key: 'recipes.cat_002',
    prompt: '猫咪家常自制宠物餐：三文鱼蔬菜饭，食材展示：三文鱼、胡萝卜、西兰花，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色',
    size: '750x420',
    format: 'webp'
  },
  {
    key: 'recipes.cat_003',
    prompt: '猫咪家常自制宠物餐：鸡肉红薯泥，食材展示：鸡胸肉、红薯、猫草，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色',
    size: '750x420',
    format: 'webp'
  },
  {
    key: 'recipes.cat_004',
    prompt: '猫咪家常自制宠物餐：牛肉蔬菜汤，食材展示：牛肉、胡萝卜、豌豆，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色',
    size: '750x420',
    format: 'webp'
  },
  {
    key: 'recipes.cat_005',
    prompt: '猫咪家常自制宠物餐：鱼肉蛋花粥，食材展示：鱼肉、鸡蛋、大米，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色',
    size: '750x420',
    format: 'webp'
  },
  {
    key: 'recipes.cat_006',
    prompt: '猫咪家常自制宠物餐：鸡肝菠菜粥，食材展示：鸡肝、菠菜、小米，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色',
    size: '750x420',
    format: 'webp'
  },
  {
    key: 'recipes.dog_001',
    prompt: '狗狗家常自制宠物餐：三文鱼藜麦饭，食材展示：三文鱼、藜麦、胡萝卜，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色',
    size: '750x420',
    format: 'webp'
  },
  {
    key: 'recipes.dog_002',
    prompt: '狗狗家常自制宠物餐：鸡肉蔬菜饭，食材展示：鸡胸肉、西兰花、红薯，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色',
    size: '750x420',
    format: 'webp'
  },
  {
    key: 'recipes.dog_003',
    prompt: '狗狗家常自制宠物餐：牛肉土豆泥，食材展示：牛肉、土豆、豌豆，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色',
    size: '750x420',
    format: 'webp'
  },
  {
    key: 'recipes.dog_004',
    prompt: '狗狗家常自制宠物餐：鱼肉蔬菜汤，食材展示：鱼肉、胡萝卜、菠菜，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色',
    size: '750x420',
    format: 'webp'
  },
  {
    key: 'recipes.dog_005',
    prompt: '狗狗家常自制宠物餐：鸡肉南瓜粥，食材展示：鸡胸肉、南瓜、大米，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色',
    size: '750x420',
    format: 'webp'
  },
  {
    key: 'recipes.dog_006',
    prompt: '狗狗家常自制宠物餐：三文鱼蔬菜饼，食材展示：三文鱼、胡萝卜、燕麦，摆在浅黄毛玻璃托盘上，俯拍，干净留白，重点突出食材形状与颜色',
    size: '750x420',
    format: 'webp'
  },

  // 食材贴纸 (10张)
  {
    key: 'stickers.chicken',
    prompt: '鸡胸肉食材贴纸，单一主体，黄系玻璃质感，透明背景PNG',
    size: '256x256',
    format: 'png'
  },
  {
    key: 'stickers.pumpkin',
    prompt: '南瓜食材贴纸，单一主体，黄系玻璃质感，透明背景PNG',
    size: '256x256',
    format: 'png'
  },
  {
    key: 'stickers.salmon',
    prompt: '三文鱼食材贴纸，单一主体，黄系玻璃质感，透明背景PNG',
    size: '256x256',
    format: 'png'
  },
  {
    key: 'stickers.sweet_potato',
    prompt: '红薯食材贴纸，单一主体，黄系玻璃质感，透明背景PNG',
    size: '256x256',
    format: 'png'
  },
  {
    key: 'stickers.beef',
    prompt: '牛肉食材贴纸，单一主体，黄系玻璃质感，透明背景PNG',
    size: '256x256',
    format: 'png'
  },
  {
    key: 'stickers.carrot',
    prompt: '胡萝卜食材贴纸，单一主体，黄系玻璃质感，透明背景PNG',
    size: '256x256',
    format: 'png'
  },
  {
    key: 'stickers.broccoli',
    prompt: '西兰花食材贴纸，单一主体，黄系玻璃质感，透明背景PNG',
    size: '256x256',
    format: 'png'
  },
  {
    key: 'stickers.rice',
    prompt: '大米食材贴纸，单一主体，黄系玻璃质感，透明背景PNG',
    size: '256x256',
    format: 'png'
  },
  {
    key: 'stickers.fish',
    prompt: '鱼肉食材贴纸，单一主体，黄系玻璃质感，透明背景PNG',
    size: '256x256',
    format: 'png'
  },
  {
    key: 'stickers.egg',
    prompt: '鸡蛋食材贴纸，单一主体，黄系玻璃质感，透明背景PNG',
    size: '256x256',
    format: 'png'
  },

  // 空状态图 (3张)
  {
    key: 'empty_states.no_network',
    prompt: '无网络连接的空状态插画，简单场景，温暖治愈不焦虑，居中构图',
    size: '750x560',
    format: 'png'
  },
  {
    key: 'empty_states.no_recommendations',
    prompt: '暂无推荐的空状态插画，简单场景，温暖治愈不焦虑，居中构图',
    size: '750x560',
    format: 'png'
  },
  {
    key: 'empty_states.no_favorites',
    prompt: '无收藏内容的空状态插画，简单场景，温暖治愈不焦虑，居中构图',
    size: '750x560',
    format: 'png'
  }
];

/**
 * 执行批量生成
 */
async function batchGenerate() {
  console.log('🎨 开始批量生成图片...');
  console.log(`📊 总计 ${imageJobs.length} 张图片`);
  console.log(`🔗 服务器地址: ${SERVER_URL}`);
  console.log('\n' + '='.repeat(50) + '\n');

  try {
    const response = await axios.post(BATCH_API, {
      jobs: imageJobs,
      style_seed: 'pawplate_v1'
    }, {
      timeout: 300000, // 5分钟超时
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = response.data;
    
    if (result.success) {
      console.log('✅ 批量生成完成！');
      console.log(`📈 统计信息:`);
      console.log(`   - 总数: ${result.total}`);
      console.log(`   - 新生成: ${result.generated}`);
      console.log(`   - 缓存命中: ${result.cached}`);
      console.log(`   - 失败: ${result.failed}`);
      
      if (result.results && result.results.length > 0) {
        console.log('\n📋 生成结果:');
        result.results.forEach((item, index) => {
          const status = item.status === 'generated' ? '🆕' : 
                        item.status === 'cached' ? '💾' : '❌';
          console.log(`   ${status} ${item.key}`);
        });
      }
      
      if (result.errors && result.errors.length > 0) {
        console.log('\n❌ 失败项目:');
        result.errors.forEach((error, index) => {
          console.log(`   ❌ ${error.key}: ${error.error}`);
        });
      }
      
      console.log('\n🎉 图片生成任务完成！');
      console.log('📁 图片已保存到 manifest.json 和 CDN');
      
    } else {
      console.error('❌ 批量生成失败:', result.error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 请确保服务器正在运行: npm run dev');
    } else if (error.code === 'ENOTFOUND') {
      console.error('💡 请检查服务器地址配置');
    } else if (error.response) {
      console.error('📄 服务器响应:', error.response.data);
    }
    
    process.exit(1);
  }
}

/**
 * 检查服务器状态
 */
async function checkServerStatus() {
  try {
    const response = await axios.get(`${SERVER_URL}/api/genimage/status`, {
      timeout: 5000
    });
    
    if (response.data.success) {
      console.log('✅ 服务器连接正常');
      console.log(`📦 服务版本: ${response.data.version}`);
      return true;
    }
  } catch (error) {
    console.error('❌ 服务器连接失败:', error.message);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 PawPlate 图片批量生成工具');
  console.log('=' .repeat(50));
  
  // 检查服务器状态
  const serverOk = await checkServerStatus();
  if (!serverOk) {
    console.log('\n💡 请先启动服务器:');
    console.log('   cd server && npm run dev');
    process.exit(1);
  }
  
  // 执行批量生成
  await batchGenerate();
}

// 运行脚本
if (require.main === module) {
  main().catch(error => {
    console.error('💥 脚本执行失败:', error);
    process.exit(1);
  });
}

module.exports = {
  batchGenerate,
  imageJobs
};