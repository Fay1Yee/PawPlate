const DoubaoImageService = require('../services/doubaoImageService');

class ImageController {
  constructor() {
    this.doubaoService = new DoubaoImageService();
  }

  // 为单个商品生成图片
  async generateProductImage(req, res) {
    try {
      const { productName, category = 'pet-food' } = req.body;
      
      if (!productName) {
        return res.status(400).json({
          success: false,
          message: '商品名称不能为空'
        });
      }

      const result = await this.doubaoService.generateImage(productName, category);
      
      res.json({
        success: true,
        data: result,
        message: '图片生成成功'
      });
    } catch (error) {
      console.error('生成商品图片失败:', error);
      res.status(500).json({
        success: false,
        message: '图片生成失败',
        error: error.message
      });
    }
  }

  // 批量生成商品图片
  async generateBatchImages(req, res) {
    try {
      const { products } = req.body;
      
      if (!products || !Array.isArray(products)) {
        return res.status(400).json({
          success: false,
          message: '商品列表格式错误'
        });
      }

      const results = await this.doubaoService.generateProductImages(products);
      
      res.json({
        success: true,
        data: results,
        message: `批量生成完成，共处理${results.length}个商品`
      });
    } catch (error) {
      console.error('批量生成图片失败:', error);
      res.status(500).json({
        success: false,
        message: '批量生成失败',
        error: error.message
      });
    }
  }

  // 获取所有商品及其图片
  async getAllProductImages(req, res) {
    try {
      // 从数据源获取所有商品
      const products = this.getAllProducts();
      
      res.json({
        success: true,
        data: products,
        message: '获取商品图片列表成功'
      });
    } catch (error) {
      console.error('获取商品图片失败:', error);
      res.status(500).json({
        success: false,
        message: '获取商品图片失败',
        error: error.message
      });
    }
  }

  // 获取所有商品数据（包含图片URL）
  getAllProducts() {
    // 宠物食品
    const petFoods = [
      { name: '皇家猫粮', sku: 'RC_CAT_001', category: 'pet-food', species: 'cat' },
      { name: '希尔斯猫粮', sku: 'HILLS_CAT_001', category: 'pet-food', species: 'cat' },
      { name: '皇家狗粮', sku: 'RC_DOG_001', category: 'pet-food', species: 'dog' },
      { name: '希尔斯狗粮', sku: 'HILLS_DOG_001', category: 'pet-food', species: 'dog' }
    ];

    // Ingredients
    const ingredients = [
      { name: 'Chicken Breast', category: 'ingredient', type: 'meat' },
      { name: 'Pumpkin', category: 'ingredient', type: 'vegetable' },
      { name: 'Salmon', category: 'ingredient', type: 'fish' },
      { name: 'Quinoa', category: 'ingredient', type: 'grain' },
      { name: 'Carrot', category: 'ingredient', type: 'vegetable' },
      { name: 'Sweet Potato', category: 'ingredient', type: 'vegetable' },
      { name: 'Rice', category: 'ingredient', type: 'grain' },
      { name: 'Potato', category: 'ingredient', type: 'vegetable' },
      { name: 'Cod Fish', category: 'ingredient', type: 'fish' },
      { name: 'Broccoli', category: 'ingredient', type: 'vegetable' },
      { name: 'Zucchini', category: 'ingredient', type: 'vegetable' }
    ];

    // Nutritional supplements
    const nutritions = [
      { name: 'Cat Nutrition Powder', category: 'nutrition', species: 'cat' },
      { name: 'Dog Nutrition Powder', category: 'nutrition', species: 'dog' },
      { name: 'Pet Vitamins', category: 'nutrition', species: 'both' },
      { name: 'Calcium Supplement', category: 'nutrition', species: 'both' }
    ];

    return [...petFoods, ...ingredients, ...nutritions];
  }

  // 初始化所有商品图片
  async initializeAllImages(req, res) {
    try {
      const products = this.getAllProducts();
      
      // 检查哪些商品还没有图片
      const productsNeedImages = products.filter(product => {
        // 这里可以检查文件系统中是否已存在图片
        return true; // 暂时为所有商品生成图片
      });

      if (productsNeedImages.length === 0) {
        return res.json({
          success: true,
          message: '所有商品都已有图片',
          data: products
        });
      }

      const results = await this.doubaoService.generateProductImages(productsNeedImages);
      
      res.json({
        success: true,
        data: results,
        message: `初始化完成，为${results.length}个商品生成了图片`
      });
    } catch (error) {
      console.error('初始化商品图片失败:', error);
      res.status(500).json({
        success: false,
        message: '初始化失败',
        error: error.message
      });
    }
  }
}

module.exports = new ImageController();