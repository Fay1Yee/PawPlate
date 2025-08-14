# PawPlate - 智能宠物食谱小程序

一个为宠物主人提供个性化食谱推荐的微信小程序，集成AI图片生成和智能推荐功能。

## 🐾 项目特色

- **AI食谱推荐**: 基于宠物品种、年龄、健康状况的个性化食谱
- **AI图片生成**: 自动生成精美的食谱配图
- **双语支持**: 中英文双语标题显示
- **完整购买流程**: 从食谱到食材采购的一站式服务
- **现代化UI**: 遵循设计系统规范的美观界面

## 🚀 技术栈

### 前端 (微信小程序)
- **框架**: 微信小程序原生开发
- **样式**: WXSS + 设计系统Token
- **状态管理**: 小程序原生状态管理
- **组件**: 模块化组件设计

### 后端 (Node.js)
- **框架**: Express.js
- **AI服务**: 集成多个AI图片生成服务
  - Stability AI
- **图片处理**: 自动图片生成和优化
- **API设计**: RESTful API架构

## 📱 主要功能

### 1. 食谱详情页面
- 完整的食谱信息展示
- AI生成的精美配图
- 双语标题支持(中文+英文)
- 营养成分和注意事项
- 制作步骤详细说明

### 2. AI图片生成
- 根据食谱内容自动生成配图
- 支持多种AI服务提供商
- 图片缓存和优化
- 自动降级到默认图片

### 3. 智能推荐
- 基于宠物信息的个性化推荐
- 考虑过敏原和健康状况
- 营养均衡分析

## 🛠️ 开发环境设置

### 前端开发
```bash
cd miniapp
# 使用微信开发者工具打开项目
# 或使用静态服务器预览
python -m http.server 8080
```

### 后端开发
```bash
cd server
npm install
npm start
```

## 📦 项目结构

```
PawPlate/
├── miniapp/                 # 微信小程序前端
│   ├── pages/               # 页面文件
│   │   ├── RecipeDetail/    # 食谱详情页
│   │   ├── Home/           # 首页
│   │   └── ...
│   ├── components/          # 组件库
│   ├── utils/              # 工具函数
│   └── assets/             # 静态资源
├── server/                  # Node.js后端
│   ├── controllers/         # 控制器
│   ├── services/           # 服务层
│   ├── routes/             # 路由
│   └── public/             # 静态文件
└── docs/                   # 项目文档
```

## 🎨 设计系统

项目采用统一的设计系统，包括：
- 色彩变量系统
- 字体层级规范
- 间距和圆角标准
- 组件设计规范

## 🔧 配置说明

### 环境变量
```bash
# server/.env
PORT=3000
STABILITY_API_KEY=your_api_key
```

### AI服务配置
项目支持多个AI图片生成服务，可在 `server/services/realImageService.js` 中配置。

## 📝 版本历史

### v1.0.0 (2025-08-14)
- ✅ 完整的食谱详情页面UI
- ✅ AI生成图片集成
- ✅ 双语标题支持
- ✅ 注意事项显示
- ✅ 设计系统规范应用

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- GitHub: [@Fay1Yee](https://github.com/Fay1Yee)
- 项目链接: [https://github.com/Fay1Yee/PawPlate](https://github.com/Fay1Yee/PawPlate)

---

**PawPlate** - 让每一餐都充满爱 🐾❤️
