# PawPlate Lexend字体系统规范 v2.1.0

## 概述

本次更新将PawPlate小程序的字体系统从Nunito/Poppins全面升级为Lexend字体，建立了完整的字号字重规范体系。Lexend是一款专为提高阅读效率而设计的字体，具有优秀的可读性和现代感。

## 字体选择理由

### Lexend字体优势
- **提高阅读效率**: Lexend经过科学研究验证，能显著提升阅读速度和理解力
- **现代简洁**: 字形设计简洁现代，符合卡通拟物风格的清新感
- **多字重支持**: 提供100-900全字重范围，满足各种设计需求
- **跨平台兼容**: 在各种设备和浏览器上都有良好的渲染效果
- **中英文混排**: 与中文字体（PingFang SC、HarmonyOS Sans）搭配和谐

## 字体系统架构

### 字体族定义
```css
/* Lexend字体系统 */
--font-primary: 'Lexend', 'PingFang SC', 'HarmonyOS Sans', sans-serif;     /* 主要标题 */
--font-secondary: 'Lexend', 'PingFang SC', 'HarmonyOS Sans', sans-serif;   /* 次要元素 */
--font-body: 'Lexend', 'PingFang SC', 'HarmonyOS Sans', sans-serif;        /* 正文内容 */
```

### 字号规范体系
```css
/* 字号规范 */
--font-size-xs: 12px;    /* 小字 - 标签、说明文字 */
--font-size-sm: 14px;    /* 次要文本 - 按钮、辅助信息 */
--font-size-base: 16px;  /* 正文 - 主要内容文字 */
--font-size-lg: 18px;    /* 副标题 - 卡片标题 */
--font-size-xl: 20px;    /* 小标题 - 二级标题 */
--font-size-2xl: 24px;   /* 主标题 - 一级标题 */
--font-size-3xl: 28px;   /* 大标题 - 页面主标题 */
--font-size-4xl: 32px;   /* 超大标题 - 特殊场景 */
```

### 字重规范体系
```css
/* 字重规范 */
--font-weight-light: 300;    /* 轻量 - 装饰性文字 */
--font-weight-normal: 400;   /* 常规 - 正文内容 */
--font-weight-medium: 500;   /* 中等 - 次要强调 */
--font-weight-semibold: 600; /* 半粗 - 重要内容 */
--font-weight-bold: 700;     /* 粗体 - 小标题 */
--font-weight-extrabold: 800; /* 超粗 - 主标题、按钮 */
--font-weight-black: 900;    /* 最粗 - 特殊强调 */
```

## 应用场景规范

### 标题层级
- **H1主标题**: 24px / 800字重 / primary字体
- **H2副标题**: 20px / 800字重 / primary字体  
- **H3小标题**: 18px / 700字重 / secondary字体

### 正文内容
- **正文段落**: 16px / 600字重 / body字体
- **重要文本**: 16px / 600字重 / body字体
- **说明文字**: 12px / 700字重 / body字体

### 交互元素
- **主要按钮**: 16px / 800字重 / primary字体
- **次要按钮**: 14px / 800字重 / secondary字体
- **输入框**: 16px / 400字重 / body字体
- **标签**: 12px / 700字重 / body字体

## 更新内容详情

### 全局样式更新 (app.ttss)
1. **字体导入**: 更新为Lexend全字重导入
2. **CSS变量**: 建立完整的字号字重变量系统
3. **基础样式**: 更新页面、按钮、文字样式的字体配置
4. **组件样式**: 更新胶囊控件等组件的字体设置

### 页面样式更新

#### Home页面 (pages/Home/index.ttss)
- 页面基础字体配置
- 标题层级样式更新
- 按钮字体规范应用

#### AI表单页面 (pages/ai/form/index.ttss)
- 聊天界面字体配置
- 消息气泡字体样式
- 输入区域字体设置
- 按钮和交互元素字体

## 设计原则

### 层次感
- 通过字重差异建立清晰的信息层级
- 主标题使用800字重，正文使用600字重
- 重要按钮使用800字重突出操作性

### 一致性
- 统一使用CSS变量，确保全局一致性
- 相同功能元素使用相同字体规范
- 保持中英文字体的和谐搭配

### 可读性
- Lexend字体提升阅读效率
- 合理的字号确保各设备可读性
- 适当的字重对比增强视觉层次

## 技术实现

### 字体加载
```css
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap');
```

### 变量应用示例
```css
.title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-extrabold);
  font-family: var(--font-primary);
}

.body-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-body);
}
```

## 性能优化

- 使用`display=swap`确保字体加载期间的文字可见性
- 合理的字重选择，避免过多字重文件加载
- 中文字体回退机制保证兼容性

## 后续优化方向

1. **字体子集化**: 根据实际使用字符优化字体文件大小
2. **动态加载**: 按需加载不同字重的字体文件
3. **本地化适配**: 针对不同地区优化字体回退策略
4. **可访问性**: 增加字体大小调节功能

---

**更新时间**: 2024年12月
**版本**: v2.1.0
**影响范围**: 全局字体系统
**兼容性**: 支持现代浏览器和微信小程序