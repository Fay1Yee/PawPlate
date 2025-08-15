Page({
  data: {
    result: { adjusted_portion_g: 0, adjusted_ingredients: [], feeding_frequency_per_day: 2, alt_ingredients: [] },
    customizedRecipe: null,
    explanation: '',
    nutritionAnalysis: null,
    recipeId: '',
    generatedImageUrl: ''
  },
  onLoad(opts) {
    // Save recipe ID if available
    if (opts.recipeId) {
      this.setData({ recipeId: opts.recipeId });
    }

    if (opts.data) {
      // Data from backend API
      try {
        const apiData = JSON.parse(decodeURIComponent(opts.data));
        if (apiData.success && apiData.customizedRecipe) {
          // Save recipe ID if included in API data
          const recipeId = apiData.recipeId || this.data.recipeId;

          this.setData({
            customizedRecipe: apiData.customizedRecipe,
            explanation: apiData.explanation || '',
            nutritionAnalysis: apiData.nutritionAnalysis || null,
            recipeId: recipeId,
            result: {
              adjusted_portion_g: apiData.customizedRecipe.totalWeight || 0,
              adjusted_ingredients: apiData.customizedRecipe.ingredients || [],
              feeding_frequency_per_day: apiData.customizedRecipe.feedingFrequency || 2,
              alt_ingredients: apiData.customizedRecipe.alternatives || []
            }
          });
          return;
        }
      } catch (e) {
        console.error('Failed to parse API data:', e);
      }
    }

    // Fallback to original logic
    const form = opts.form ? JSON.parse(decodeURIComponent(opts.form)) : {};
    const base = form.species === 'dog' ? [
      { name: 'Salmon', grams: 120 }, { name: 'Quinoa', grams: 60 }, { name: 'Carrot', grams: 60 }, { name: 'Broccoli', grams: 60 }
    ] : [
      { name: 'Chicken Breast', grams: 120 }, { name: 'Pumpkin', grams: 100 }, { name: 'Cat Nutrition Powder', grams: 5 }
    ];
    const weight = parseFloat(form.weight_kg || '3.5');
    const ratio = Math.max(0.6, Math.min(1.6, weight / 3.5));
    const adjusted = base.map(i => ({ ...i, grams: Math.round(i.grams * ratio) }));
    const total = adjusted.reduce((s, i) => s + i.grams, 0);
    this.setData({
      result: {
        adjusted_portion_g: total,
        adjusted_ingredients: adjusted,
        feeding_frequency_per_day: (weight > 10 ? 3 : 2),
        alt_ingredients: ['Pumpkin Puree', 'Sweet Potato Puree']
      }
    });
  },
  goBuy() {
    // Pass complete ingredient information to purchase page
    const ingredients = this.data.result.adjusted_ingredients;
    if (ingredients && ingredients.length > 0) {
      const ingredientsData = encodeURIComponent(JSON.stringify(ingredients));
      tt.navigateTo({ url: `/pages/purchase/handoff/index?ingredients=${ingredientsData}&platform=ddmc` });
    } else {
      tt.navigateTo({ url: '/pages/purchase/handoff/index' });
    }
  },
  goRecipe() {
    // Get current page stack
    const pages = getCurrentPages();

    // Check if recipe page exists in page stack
    let recipePageIndex = -1;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].route && pages[i].route.includes('pages/recipe/index')) {
        recipePageIndex = i;
        break;
      }
    }

    if (recipePageIndex !== -1) {
      // If recipe page found, navigate back to it
      const delta = pages.length - 1 - recipePageIndex;
      tt.navigateBack({ delta });
    } else if (this.data.recipeId) {
      // If no recipe page found but have recipe ID, navigate to recipe page
      tt.navigateTo({
        url: `/pages/recipe/index?id=${this.data.recipeId}`
      });
    } else {
      // If neither recipe page nor recipe ID found, return to home
      tt.switchTab({
        url: '/pages/Home/index'
      });
    }
  },

  generateImage() {
    tt.request({
      url: 'http://localhost:3000/api/real-genimage/generate',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        prompt: '鱼眼镜头，一只猫咪的头部，画面呈现出猫咪的五官因为拍摄方式扭曲的效果。',
        options: {
          category: 'pets',
          size: '1024x1024',
          style: 'realistic',
          service: 'doubao'
        }
      },
      success: (res) => {
        if (res.data && res.data.success && res.data.localPath) {
          // 使用本地生成的图片路径
          const imageUrl = `http://localhost:3000${res.data.localPath}`;
          this.setData({
            generatedImageUrl: imageUrl
          });
        } else {
          tt.showToast({
            title: '生成图片失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('API 调用失败:', err);
        tt.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    });
  }
});
