// 图片管理工具 - 统一获取、缓存和动态生成
const cache = {};
let manifest = null;
const generatedImages = require('./generated-images.js');

// 预设图片映射
const imageMap = {
  'recipes.cat_001': 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="catBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFE4B5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F6C642;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#catBg)" rx="20"/>
      <circle cx="100" cy="80" r="35" fill="#FF8C00"/>
      <circle cx="85" cy="70" r="3" fill="#000"/>
      <circle cx="115" cy="70" r="3" fill="#000"/>
      <polygon points="100,75 95,85 105,85" fill="#FF69B4"/>
      <text x="100" y="140" text-anchor="middle" fill="#8B4513" font-size="14" font-weight="bold">南瓜鸡肉粥</text>
      <text x="100" y="160" text-anchor="middle" fill="#A0522D" font-size="12">猫咪专用</text>
    </svg>
  `),
  'recipes.dog_001': 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dogBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#E6F3FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#87CEEB;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#dogBg)" rx="20"/>
      <ellipse cx="100" cy="80" rx="40" ry="35" fill="#DEB887"/>
      <circle cx="85" cy="70" r="3" fill="#000"/>
      <circle cx="115" cy="70" r="3" fill="#000"/>
      <ellipse cx="100" cy="85" rx="8" ry="6" fill="#000"/>
      <text x="100" y="140" text-anchor="middle" fill="#4682B4" font-size="14" font-weight="bold">三文鱼藜麦饭</text>
      <text x="100" y="160" text-anchor="middle" fill="#5F9EA0" font-size="12">狗狗专用</text>
    </svg>
  `),
  'products.cat_food': 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#F6C642" rx="15"/>
      <rect x="20" y="20" width="80" height="60" fill="#E59A00" rx="10"/>
      <text x="60" y="95" text-anchor="middle" fill="#8B4513" font-size="12" font-weight="bold">皇家猫粮</text>
    </svg>
  `),
  'products.dog_food': 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#87CEEB" rx="15"/>
      <rect x="20" y="20" width="80" height="60" fill="#4682B4" rx="10"/>
      <text x="60" y="95" text-anchor="middle" fill="#2F4F4F" font-size="12" font-weight="bold">优卡狗粮</text>
    </svg>
  `)
};

/**
 * 统一图片获取函数
 * @param {string} key - 图片键值，格式：category.name（如 recipes.cat_001）
 * @param {string} fallbackPrompt - 当图片不存在时的生成提示词（已废弃）
 * @param {object} options - 可选参数
 * @returns {string} 图片URL
 */
function img(key, fallbackPrompt, options = {}) {
  // 优先检查AI生成的图片
  if (generatedImages[key]) {
    return generatedImages[key];
  }
  
  // Return image directly from preset mapping
  if (imageMap[key]) {
    return imageMap[key];
  }

  // 根据key生成默认图片
  const [category, name] = key.split('.');
  
  if (category === 'recipes') {
    // 菜谱图片
    const isForCat = name.includes('cat') || (fallbackPrompt && fallbackPrompt.includes('猫'));
    const bgColor = isForCat ? '#FFE4B5' : '#E6F3FF';
    const accentColor = isForCat ? '#F6C642' : '#87CEEB';
    const textColor = isForCat ? '#8B4513' : '#4682B4';
    
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}" rx="20"/>
        <circle cx="100" cy="80" r="30" fill="${accentColor}"/>
        <text x="100" y="140" text-anchor="middle" fill="${textColor}" font-size="14" font-weight="bold">${name}</text>
        <text x="100" y="160" text-anchor="middle" fill="${textColor}" font-size="12">营养美味</text>
      </svg>
    `);
  }
  
  if (category === 'products') {
    // 商品图片
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#F6C642" rx="15"/>
        <rect x="20" y="20" width="80" height="60" fill="#E59A00" rx="10"/>
        <text x="60" y="95" text-anchor="middle" fill="#8B4513" font-size="12" font-weight="bold">${name}</text>
      </svg>
    `);
  }
  
  // 默认占位图
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="defaultBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFF4E6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFE4B5;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#defaultBg)" rx="20"/>
      <circle cx="100" cy="100" r="30" fill="#FFD700" opacity="0.5"/>
      <text x="100" y="110" text-anchor="middle" fill="#B8860B" font-size="16" font-weight="bold">${key}</text>
    </svg>
  `);
}

/**
 * 预加载图片
 * @param {Array<string>} keys - 图片键值数组
 */
async function preloadImages(keys) {
  const promises = keys.map(key => {
    return new Promise((resolve) => {
      try {
        const url = img(key, null);
        resolve(url);
      } catch (err) {
        console.warn(`预加载图片 ${key} 失败:`, err);
        resolve(null);
      }
    });
  });
  
  await Promise.all(promises);
}

/**
 * 清除图片缓存
 * @param {string} key - 可选，指定清除的图片键值
 */
function clearImageCache(key) {
  if (key) {
    delete cache[key];
    tt.removeStorageSync(`img_${key}`);
  } else {
    // 清除所有缓存
    Object.keys(cache).forEach(k => delete cache[k]);
    const storageInfo = tt.getStorageInfoSync();
    storageInfo.keys.forEach(k => {
      if (k.startsWith('img_')) {
        tt.removeStorageSync(k);
      }
    });
  }
}

/**
 * 获取缓存统计信息
 */
function getCacheStats() {
  const memoryCount = Object.keys(cache).length;
  const storageInfo = tt.getStorageInfoSync();
  const storageCount = storageInfo.keys.filter(k => k.startsWith('img_')).length;
  
  return {
    memoryCache: memoryCount,
    storageCache: storageCount,
    totalSize: storageInfo.currentSize
  };
}

// 简化的get方法，保持向后兼容
function get(key) {
  return img(key);
}

module.exports = {
  img,
  get,
  preloadImages,
  clearImageCache,
  getCacheStats
};