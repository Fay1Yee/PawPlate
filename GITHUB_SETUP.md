# GitHub 仓库创建和自动更新指南

## 🚀 第一步：在GitHub上创建仓库

### 1. 登录GitHub
访问 [GitHub](https://github.com) 并登录您的账户 `Fay1Yee`

### 2. 创建新仓库
1. 点击右上角的 `+` 按钮，选择 `New repository`
2. 填写仓库信息：
   - **Repository name**: `PawPlate`
   - **Description**: `智能宠物食谱小程序 - AI驱动的个性化宠物营养餐推荐平台`
   - **Visibility**: 选择 `Public`（推荐）或 `Private`
   - **不要**勾选 "Add a README file"（我们已经有了）
   - **不要**勾选 "Add .gitignore"（我们已经有了）
   - **不要**勾选 "Choose a license"（我们已经有了）
3. 点击 `Create repository`

## 🔗 第二步：连接本地仓库到GitHub

### 1. 添加远程仓库
```bash
git remote add origin https://github.com/Fay1Yee/PawPlate.git
```

### 2. 推送代码到GitHub
```bash
# 推送主分支
git push -u origin main

# 推送所有标签
git push origin --tags
```

## ⚙️ 第三步：设置自动更新（GitHub Actions）

### 1. 创建GitHub Actions工作流
创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy PawPlate

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: server/package-lock.json
    
    - name: Install dependencies
      run: |
        cd server
        npm ci
    
    - name: Run tests
      run: |
        cd server
        npm test
    
    - name: Build project
      run: |
        cd server
        npm run build --if-present

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      run: |
        echo "部署到生产环境"
        # 这里可以添加实际的部署脚本
```

### 2. 设置自动版本标签
创建 `.github/workflows/release.yml` 文件：

```yaml
name: Auto Release

on:
  push:
    branches: [ main ]
    paths-ignore:
      - 'README.md'
      - 'docs/**'

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    
    - name: Generate version
      id: version
      run: |
        # 获取最新标签
        LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v1.0.0")
        echo "Latest tag: $LATEST_TAG"
        
        # 生成新版本号（简单的补丁版本递增）
        NEW_VERSION=$(echo $LATEST_TAG | awk -F. '{$NF = $NF + 1;} 1' | sed 's/ /./g')
        echo "New version: $NEW_VERSION"
        echo "version=$NEW_VERSION" >> $GITHUB_OUTPUT
    
    - name: Create Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ steps.version.outputs.version }}
        release_name: PawPlate ${{ steps.version.outputs.version }}
        body: |
          ## 🎉 新版本发布
          
          ### 更新内容
          - 自动生成的版本发布
          - 查看完整更改: [比较更改](https://github.com/Fay1Yee/PawPlate/compare/${{ github.event.before }}...${{ github.sha }})
          
          ### 🚀 快速开始
          ```bash
          git clone https://github.com/Fay1Yee/PawPlate.git
          cd PawPlate
          
          # 启动后端
          cd server && npm install && npm start
          
          # 启动前端（新终端）
          cd miniapp && python -m http.server 8080
          ```
        draft: false
        prerelease: false
```

## 📋 第四步：执行部署命令

在您的本地项目目录中运行以下命令：

```bash
# 1. 添加远程仓库
git remote add origin https://github.com/Fay1Yee/PawPlate.git

# 2. 推送代码
git push -u origin main

# 3. 推送标签
git push origin --tags

# 4. 创建GitHub Actions目录
mkdir -p .github/workflows

# 5. 验证推送成功
git remote -v
```

## 🔄 第五步：设置自动同步

### 1. 配置Git钩子（可选）
创建 `.git/hooks/pre-push` 文件：

```bash
#!/bin/sh
echo "正在推送到GitHub..."
# 可以在这里添加自动测试或构建脚本
```

### 2. 设置定期同步（可选）
如果需要定期自动推送，可以设置cron任务：

```bash
# 编辑crontab
crontab -e

# 添加以下行（每天晚上11点自动推送）
0 23 * * * cd /Users/zephyruszhou/Documents/DOU2025/PawPlate && git add . && git commit -m "auto: 定期自动提交 $(date)" && git push origin main
```

## ✅ 验证部署

### 1. 检查GitHub仓库
访问 `https://github.com/Fay1Yee/PawPlate` 确认：
- [ ] 代码已成功上传
- [ ] README.md 正确显示
- [ ] 标签已创建
- [ ] Actions 工作流正常运行

### 2. 测试克隆
```bash
# 在另一个目录测试克隆
git clone https://github.com/Fay1Yee/PawPlate.git test-clone
cd test-clone
```

## 🎯 后续维护

### 日常开发流程
```bash
# 1. 开发新功能
git checkout -b feature/new-feature
# ... 进行开发 ...

# 2. 提交更改
git add .
git commit -m "feat: 添加新功能"

# 3. 推送到GitHub
git push origin feature/new-feature

# 4. 在GitHub上创建Pull Request
# 5. 合并到main分支后自动触发部署
```

### 版本发布
```bash
# 创建新版本标签
git tag v1.2.0 -m "发布版本 v1.2.0"
git push origin v1.2.0
```

---

🎉 **恭喜！** 您的PawPlate项目现在已经准备好发布到GitHub并设置了自动更新功能！