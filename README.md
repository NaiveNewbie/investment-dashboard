# 美股投资仪表盘

个人美股长期投资追踪系统，包含：
- 📊 **投资组合** — 持仓管理、盈亏追踪、配置比例可视化
- 📅 **定投计划** — 每月DCA记录、计划vs实际对比
- 🧮 **复利计算器** — 参数化增长预测、三种情景对比
- 📖 **投资手册** — 操作清单、铁律规则、风险应对指南

---

## 🚀 部署到 GitHub Pages（5步）

### 第1步：Fork或创建仓库

将这个项目上传到你的GitHub仓库，仓库名建议：`investment-dashboard`

### 第2步：修改 package.json

打开 `package.json`，把第4行改成你自己的GitHub用户名：

```json
"homepage": "https://NaiveNewbie.github.io/investment-dashboard",
```

### 第3步：安装依赖

```bash
npm install
```

### 第4步：部署

```bash
npm run deploy
```

这个命令会自动：
1. 构建生产版本
2. 推送到 `gh-pages` 分支
3. GitHub Pages 自动发布

### 第5步：开启 GitHub Pages

1. 进入仓库 → Settings → Pages
2. Source 选择 `gh-pages` 分支
3. 等待1-2分钟，访问 `https://你的用户名.github.io/investment-dashboard`

---

## 💻 本地运行

```bash
npm install
npm start
```

浏览器打开 `http://localhost:3000`

---

## 📁 项目结构

```
src/
├── App.js                 # 主应用，侧边栏导航
└── components/
    ├── Dashboard.js       # 投资组合仪表盘
    ├── DCA.js             # 定投计划追踪
    ├── Calculator.js      # 复利计算器
    └── Playbook.js        # 投资手册
```

---

## ⚠️ 免责声明

本工具仅供个人记录和学习参考，不构成投资建议。投资有风险，请谨慎决策。
