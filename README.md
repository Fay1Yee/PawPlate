# PawPlate

## 项目结构

```
PawPlate/
├── server/         # Node.js 后端（Express）
│   ├── controllers/ # 控制器
│   ├── models/     # 数据模型
│   ├── routes/     # 路由
│   ├── services/   # 业务逻辑
│   ├── utils/      # 工具函数
│   ├── app.js      # 后端入口文件
│   └── package.json # 项目配置
├── miniapp/        # PawPlate小程序前端
│   ├── pages/      # 页面
│   │   ├── RecipeDetail/ # 菜谱详情页
│   │   ├── AIForm/       # AI定制表单页
│   │   ├── AIResult/     # AI结果页
│   │   └── Profile/      # 个人资料页
│   ├── components/ # 组件
│   │   ├── IngredientList/ # 食材列表组件
│   │   ├── StepCard/       # 步骤卡片组件
│   │   ├── BuyButton/      # 购买按钮组件
│   │   └── Toast/          # 提示组件
│   ├── store/      # 状态管理
│   ├── app.js      # 小程序入口文件
│   ├── app.json    # 小程序配置文件
│   └── app.wxss    # 小程序全局样式
├── README.md
└── .gitignore
```

## 功能描述

PawPlate 是一个智能宠物营养餐推荐平台，主要功能包括：

### 前端功能

1. **页面**:
   - RecipeDetail: 菜谱详情页
   - AIForm: AI定制表单页
   - AIResult: AI结果页
   - Profile: 个人资料页

2. **组件**:
   - IngredientList: 食材列表组件
   - StepCard: 步骤卡片组件
   - BuyButton: 购买按钮组件
   - Toast: 提示组件

3. **状态管理**:
   - user: 用户信息
   - petProfile: 宠物资料
   - favoritedRecipes: 收藏的菜谱

### 后端功能

1. **菜谱/食材/映射表CRUD**
2. **AI定制接口封装**（失败兜底模板）
3. **统计埋点写库**（pv/uv、点击、转化）
4. **AI逻辑**（首版规则+大模型混合）
   - 规则库：不同体重段每日热量建议
   - 模型：根据体重/年龄调整克数与比例，生成注意事项
5. **过敏/禁忌词过滤**（葱、巧克力、葡萄、木糖醇等）
6. **第三方平台对接**（先模拟，后正式）
   - 叮咚/京东到家：组合跳转URL生成
   - 城市不可达兜底：提示"换平台/自备"文案

### 合规与提示

- 明确"科普信息，不替代兽医建议"
- 生食/熟食安全提示、分量与保存说明

## 技术栈

- **后端**: Node.js + Express
- **前端**: PawPlate 小程序
- **AI服务**: 规则引擎 + 大模型混合
- **数据库**: TBD

## 开发指南

### 后端开发
```bash
cd server
npm install
npm run dev
```

### 小程序开发
```bash
cd miniapp
# 使用 PawPlate 开发者工具打开项目
```

## 项目状态

🚧 开发中...
