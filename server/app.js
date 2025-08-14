const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务 - 提供生成的商品图片
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// 路由
app.get('/', (req, res) => {
  res.send('抖音宠物食品推荐小程序后端服务');
});

// 引入路由文件
const recipesRouter = require('./routes/recipes');
const aiRouter = require('./routes/ai');
const purchaseRouter = require('./routes/purchase');
const imagesRouter = require('./routes/images');
const genimageRouter = require('./routes/genimage');
const realGenimageRouter = require('./routes/realGenimage');

// 使用路由
app.use('/api/recipes', recipesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/purchase', purchaseRouter);
app.use('/api/images', imagesRouter);
app.use('/api/genimage', genimageRouter);
app.use('/api/real-genimage', realGenimageRouter);

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app;