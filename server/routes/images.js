const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// 为单个商品生成图片
router.post('/generate', imageController.generateProductImage.bind(imageController));

// 批量生成商品图片
router.post('/generate-batch', imageController.generateBatchImages.bind(imageController));

// 获取所有商品图片
router.get('/products', imageController.getAllProductImages.bind(imageController));

// 初始化所有商品图片
router.post('/initialize', imageController.initializeAllImages.bind(imageController));

module.exports = router;