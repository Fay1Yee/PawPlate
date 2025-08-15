#!/usr/bin/env node

/**
 * 食材图标生成脚本
 * 为PawPlate小程序生成符合UI视觉风格的食材图标
 */

const fs = require('fs').promises;
const path = require('path');

// 食材图标配置 - 符合PawPlate卡通拟物风格
const ingredientIcons = [
  {
    name: '鸡胸肉',
    key: 'chicken_breast',
    colors: {
      primary: '#F6C642',
      secondary: '#E59A00',
      accent: '#FFE4B5'
    },
    emoji: '🍗'
  },
  {
    name: '三文鱼',
    key: 'salmon',
    colors: {
      primary: '#FF7F7F',
      secondary: '#FF6B6B',
      accent: '#FFE4E1'
    },
    emoji: '🐟'
  },
  {
    name: '牛肉',
    key: 'beef',
    colors: {
      primary: '#8B4513',
      secondary: '#A0522D',
      accent: '#DEB887'
    },
    emoji: '🥩'
  },
  {
    name: '南瓜',
    key: 'pumpkin',
    colors: {
      primary: '#FF8C00',
      secondary: '#FF7F00',
      accent: '#FFEFD5'
    },
    emoji: '🎃'
  },
  {
    name: '胡萝卜',
    key: 'carrot',
    colors: {
      primary: '#FF8C00',
      secondary: '#FF7F00',
      accent: '#FFEFD5'
    },
    emoji: '🥕'
  },
  {
    name: '西兰花',
    key: 'broccoli',
    colors: {
      primary: '#32CD32',
      secondary: '#228B22',
      accent: '#F0FFF0'
    },
    emoji: '🥦'
  },
  {
    name: '红薯',
    key: 'sweet_potato',
    colors: {
      primary: '#FF6347',
      secondary: '#FF4500',
      accent: '#FFE4E1'
    },
    emoji: '🍠'
  },
  {
    name: '西葫芦',
    key: 'zucchini',
    colors: {
      primary: '#9ACD32',
      secondary: '#7CFC00',
      accent: '#F5FFFA'
    },
    emoji: '🥒'
  },
  {
    name: '土豆',
    key: 'potato',
    colors: {
      primary: '#DEB887',
      secondary: '#D2B48C',
      accent: '#FFF8DC'
    },
    emoji: '🥔'
  },
  {
    name: '金枪鱼',
    key: 'tuna',
    colors: {
      primary: '#4682B4',
      secondary: '#5F9EA0',
      accent: '#E0F6FF'
    },
    emoji: '🐟'
  },
  {
    name: '火鸡肉',
    key: 'turkey',
    colors: {
      primary: '#CD853F',
      secondary: '#D2691E',
      accent: '#F5DEB3'
    },
    emoji: '🦃'
  },
  {
    name: '藜麦',
    key: 'quinoa',
    colors: {
      primary: '#F0E68C',
      secondary: '#DAA520',
      accent: '#FFFACD'
    },
    emoji: '🌾'
  }
];

// 创建符合PawPlate风格的SVG图标
function createIngredientIcon(ingredient) {
  const { name, colors, emoji } = ingredient;
  const { primary, secondary, accent } = colors;
  
  return `<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg_${ingredient.key}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${primary};stop-opacity:0.8" />
    </linearGradient>
    <linearGradient id="main_${ingredient.key}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondary};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow_${ingredient.key}">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.2)"/>
    </filter>
  </defs>
  
  <!-- 背景圆形 -->
  <circle cx="40" cy="40" r="35" fill="url(#bg_${ingredient.key})" filter="url(#shadow_${ingredient.key})"/>
  
  <!-- 主要装饰圆形 -->
  <circle cx="40" cy="40" r="28" fill="url(#main_${ingredient.key})" opacity="0.9"/>
  
  <!-- 高光效果 -->
  <circle cx="35" cy="32" r="8" fill="rgba(255,255,255,0.4)"/>
  
  <!-- Emoji图标 -->
  <text x="40" y="48" text-anchor="middle" font-size="24" dominant-baseline="middle">${emoji}</text>
  
  <!-- 食材名称 -->
  <text x="40" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" 
        font-size="10" font-weight="600" fill="${secondary}">${name}</text>
</svg>`;
}

// 生成所有食材图标
async function generateIngredientIcons() {
  console.log('🎨 生成PawPlate食材图标...');
  console.log(`📸 准备生成 ${ingredientIcons.length} 个食材图标...\n`);
  
  // 创建图标目录
  const iconDir = path.join(__dirname, '../public/images/ingredient-icons');
  
  try {
    await fs.access(iconDir);
  } catch {
    await fs.mkdir(iconDir, { recursive: true });
    console.log('📁 创建图标目录: /images/ingredient-icons/');
  }
  
  const results = [];
  
  for (let i = 0; i < ingredientIcons.length; i++) {
    const ingredient = ingredientIcons[i];
    console.log(`🎨 [${i + 1}/${ingredientIcons.length}] 生成: ${ingredient.name} (${ingredient.key})`);
    
    try {
      const svgContent = createIngredientIcon(ingredient);
      const fileName = `${ingredient.key}_icon.svg`;
      const filePath = path.join(iconDir, fileName);
      
      await fs.writeFile(filePath, svgContent, 'utf8');
      
      const localPath = `/images/ingredient-icons/${fileName}`;
      
      console.log(`✅ 成功生成: ${fileName}`);
      
      results.push({
        name: ingredient.name,
        key: ingredient.key,
        success: true,
        fileName,
        localPath,
        colors: ingredient.colors,
        emoji: ingredient.emoji
      });
      
    } catch (error) {
      console.error(`❌ 生成失败: ${error.message}`);
      results.push({
        name: ingredient.name,
        key: ingredient.key,
        success: false,
        error: error.message
      });
    }
  }
  
  // 生成图标映射文件
  const iconMapping = {};
  results.filter(r => r.success).forEach(result => {
    iconMapping[result.key] = {
      name: result.name,
      path: result.localPath,
      colors: result.colors,
      emoji: result.emoji
    };
  });
  
  const mappingPath = path.join(iconDir, 'ingredient-icons-mapping.json');
  await fs.writeFile(mappingPath, JSON.stringify(iconMapping, null, 2), 'utf8');
  
  // 输出统计信息
  console.log('\n' + '='.repeat(50));
  console.log('🎉 食材图标生成完成！');
  console.log('📊 统计信息:');
  console.log(`   - 总数: ${results.length}`);
  console.log(`   - 成功生成: ${results.filter(r => r.success).length}`);
  console.log(`   - 失败: ${results.filter(r => !r.success).length}`);
  
  const successResults = results.filter(r => r.success);
  if (successResults.length > 0) {
    console.log('\n✅ 成功生成的图标:');
    successResults.forEach(result => {
      console.log(`   🎯 ${result.name}: ${result.localPath}`);
    });
  }
  
  console.log('\n🎯 生成完成！图标已保存到:');
  console.log('   📁 /server/public/images/ingredient-icons/');
  console.log('\n🌐 可通过以下URL访问:');
  console.log('   🔗 http://localhost:3000/images/ingredient-icons/');
  console.log('\n📋 图标映射文件:');
  console.log('   📄 ingredient-icons-mapping.json');
  
  return results;
}

// 如果直接运行此脚本
if (require.main === module) {
  generateIngredientIcons()
    .then(results => {
      console.log('\n🎊 食材图标生成任务完成！');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ 生成过程中出现错误:', error);
      process.exit(1);
    });
}

module.exports = {
  generateIngredientIcons,
  ingredientIcons
};