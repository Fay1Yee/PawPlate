const products = require('../../../data/products.js');
const platforms = require('../../../data/platforms.js');

Page({
  data: {
    product: null,
    platforms: [],
    sku: '',
    platform: 'ddmc',
    ingredients: []
  },

  onLoad(opts) {
    // Get product ID from options or use SKU
    const productId = opts.id;
    const sku = opts.sku || '';
    const platform = opts.platform || 'ddmc';
    
    // Find product by ID or use first product as default
    const product = products.find(p => p.id == productId);
    
    // Store SKU and platform for later use
    this.sku = sku;
    this.platform = platform;
    
    // Prepare ingredient list for shopping cart
    let ingredients = [];
    
    // Check if ingredients data is passed from AI result page
    if (opts.ingredients) {
      try {
        const parsedIngredients = JSON.parse(decodeURIComponent(opts.ingredients));
        ingredients = parsedIngredients.map(ing => ({
          name: ing.name,
          amount: ing.grams || ing.amount || '0'
        }));
      } catch (e) {
        console.error('Failed to parse ingredients data:', e);
      }
    } else if (sku) {
      // Fallback to SKU parsing for backward compatibility
      const [name, amount] = sku.split('_');
      if (name && amount) {
        ingredients.push({
          name: name,
          amount: amount.replace('g', '')
        });
      }
    }
    
    this.setData({
      product: product || products[0],
      platforms: platforms,
      sku: sku,
      platform: platform,
      ingredients: ingredients
    });
  },
  
  open(e) {
    const platform = e.currentTarget ? e.currentTarget.dataset.platform : e;
    
    // In a real app, this would call an API to generate a shopping cart link
    // tt.request({ 
    //   url:'/api/purchase/link', 
    //   method:'POST', 
    //   data:{ 
    //     ingredients: this.data.ingredients.length > 0 ? this.data.ingredients : [{name: this.sku, grams: 0}], 
    //     city: 'SH', 
    //     platform: platform 
    //   }, 
    //   success: ({data}) => {
    //     if (data.cart_url) {
    //       tt.openSchema({ schema: data.cart_url });
    //     } else {
    //       this.copyFallback(platform);
    //     }
    //   },
    //   fail: () => {
    //     this.copyFallback(platform);
    //   }
    // });
    
    // For demo purposes, just use the fallback
    this.copyFallback(platform);
  },
  
  copyFallback(platform) {
    const platformId = platform || this.data.platform;
    const platformObj = this.data.platforms.find(p => p.id === platformId) || this.data.platforms[0];
    const platformName = platformObj ? platformObj.name : 'shopping platform';
    
    // Create a shopping list with all ingredients
    let shoppingList = `Shopping List for ${platformName}:\n`;
    
    if (this.data.ingredients.length > 0) {
      this.data.ingredients.forEach(ing => {
        shoppingList += `- ${ing.name} (${ing.amount}g)\n`;
      });
    } else if (this.sku) {
      shoppingList += `- ${this.sku}\n`;
    } else if (this.data.product) {
      shoppingList += `- ${this.data.product.name}\n`;
    }
    
    // Copy to clipboard
    tt.setClipboardData({ 
      data: shoppingList
    });
    
    tt.showToast({ 
      title: 'Shopping list copied',
      icon: 'success'
    });
  }
});