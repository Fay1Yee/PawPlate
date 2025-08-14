const fs = require('fs').promises;
const path = require('path');

// 增强的占位符图片配置
const enhancedPlaceholders = [
  {
    key: 'recipe.chicken_veggie_bowl',
    title: 'Chicken & Veggie Bowl',
    description: 'Lean chicken breast with fresh vegetables',
    colors: {
      primary: '#8FBC8F',
      secondary: '#F0E68C',
      accent: '#DDA0DD'
    },
    icon: '🍗'
  },
  {
    key: 'recipe.tuna_surprise',
    title: 'Tuna Surprise',
    description: 'Fresh tuna with sweet potato',
    colors: {
      primary: '#20B2AA',
      secondary: '#FF7F50',
      accent: '#DDA0DD'
    },
    icon: '🐟'
  }
];

function createEnhancedSVG(config) {
  const { title, description, colors, icon } = config;
  
  return `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${config.key}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:0.2" />
    </linearGradient>
    <filter id="shadow-${config.key}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.1)"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="300" fill="url(#bg-${config.key})" rx="12"/>
  
  <!-- Main content area -->
  <rect x="20" y="20" width="360" height="260" fill="white" rx="8" filter="url(#shadow-${config.key})"/>
  
  <!-- Icon circle -->
  <circle cx="200" cy="100" r="40" fill="${colors.primary}" opacity="0.2"/>
  <circle cx="200" cy="100" r="30" fill="${colors.primary}" opacity="0.3"/>
  
  <!-- Icon -->
  <text x="200" y="115" text-anchor="middle" font-size="32" fill="${colors.primary}">${icon}</text>
  
  <!-- Title -->
  <text x="200" y="160" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#333">${title}</text>
  
  <!-- Description -->
  <text x="200" y="185" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" fill="#666">${description}</text>
  
  <!-- Decorative elements -->
  <circle cx="80" cy="60" r="3" fill="${colors.accent}" opacity="0.6"/>
  <circle cx="320" cy="80" r="2" fill="${colors.secondary}" opacity="0.8"/>
  <circle cx="100" cy="240" r="2" fill="${colors.primary}" opacity="0.5"/>
  <circle cx="300" cy="220" r="3" fill="${colors.accent}" opacity="0.4"/>
  
  <!-- Bottom accent line -->
  <rect x="50" y="250" width="300" height="2" fill="${colors.primary}" opacity="0.3" rx="1"/>
</svg>`;
}

async function generateEnhancedPlaceholders() {
  console.log('🎨 生成增强版占位符图片...');
  console.log(`📸 准备生成 ${enhancedPlaceholders.length} 张增强占位符...\n`);
  
  const imageDir = path.join(__dirname, '../public/images/ai-generated/recipes');
  
  // 确保目录存在
  try {
    await fs.access(imageDir);
  } catch {
    await fs.mkdir(imageDir, { recursive: true });
  }
  
  const results = [];
  
  for (let i = 0; i < enhancedPlaceholders.length; i++) {
    const config = enhancedPlaceholders[i];
    console.log(`🎨 [${i + 1}/${enhancedPlaceholders.length}] 生成: ${config.key}`);
    console.log(`📝 标题: ${config.title}`);
    
    try {
      const svgContent = createEnhancedSVG(config);
      const fileName = `${config.key.replace(/\./g, '_')}_enhanced_${Date.now()}.svg`;
      const filePath = path.join(imageDir, fileName);
      
      await fs.writeFile(filePath, svgContent, 'utf8');
      
      const localPath = `/images/ai-generated/recipes/${fileName}`;
      
      console.log(`✅ 成功生成: ${fileName}`);
      
      results.push({
        key: config.key,
        success: true,
        fileName,
        localPath,
        title: config.title
      });
      
    } catch (error) {
      console.error(`❌ 生成失败: ${error.message}`);
      results.push({
        key: config.key,
        success: false,
        error: error.message
      });
    }
    
    console.log('');
  }
  
  // 输出统计信息
  console.log('==================================================');
  console.log('🎉 增强占位符生成完成！');
  console.log('📊 统计信息:');
  console.log(`   - 总数: ${results.length}`);
  console.log(`   - 成功生成: ${results.filter(r => r.success).length}`);
  console.log(`   - 失败: ${results.filter(r => !r.success).length}`);
  
  const successResults = results.filter(r => r.success);
  if (successResults.length > 0) {
    console.log('\n✅ 成功生成的占位符:');
    successResults.forEach(result => {
      console.log(`   🖼️  ${result.title}: ${result.localPath}`);
    });
  }
  
  console.log('\n🎯 生成完成！图片已保存到:');
  console.log('   📁 /server/public/images/ai-generated/recipes/');
  console.log('\n🌐 可通过以下URL访问:');
  console.log('   🔗 http://localhost:3000/images/ai-generated/recipes/');
  
  return results;
}

// 运行生成任务
if (require.main === module) {
  generateEnhancedPlaceholders()
    .then(results => {
      console.log('\n🎊 任务完成！');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ 任务失败:', error);
      process.exit(1);
    });
}

module.exports = { generateEnhancedPlaceholders };