# 诗词赏析网站 - 安装配置指南

## 快速开始

### 第一步：安装依赖

```bash
npm install
```

### 第二步：配置 Supabase

#### 1. 创建 Supabase 项目

访问 [https://supabase.com](https://supabase.com)，注册并创建一个新项目。

#### 2. 创建数据库表

在 Supabase 控制台中：
1. 进入 **SQL Editor**
2. 复制 `database.sql` 文件的全部内容
3. 粘贴到 SQL Editor 中并执行

这将创建：
- ✅ `authors` 表（作者表）
- ✅ `poems` 表（诗词表）
- ✅ `collections` 表（收藏表）
- ✅ `comments` 表（评论表）
- ✅ 必要的索引和函数
- ✅ 示例数据
- ✅ RLS 安全策略

#### 3. 获取 API 密钥

1. 在 Supabase 控制台进入 **Settings** > **API**
2. 复制以下信息：
   - **Project URL**（项目URL）
   - **anon public** key（匿名公钥）

#### 4. 配置环境变量

创建 `.env` 文件（参考 `.env.example`）：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Supabase 信息：

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 第三步：运行项目

```bash
npm run dev
```

浏览器会自动打开 http://localhost:3000

## 项目结构说明

```
poem/
├── src/
│   ├── components/          # 公共组件
│   │   └── Navbar.jsx       # 导航栏组件
│   ├── pages/               # 页面组件
│   │   ├── Home.jsx         # 首页（热门诗词、搜索、作者列表）
│   │   ├── PoemDetail.jsx   # 诗词详情页（内容、赏析、评论、收藏）
│   │   ├── AuthorDetail.jsx # 作者详情页（作者信息、作品列表）
│   │   └── Collection.jsx   # 收藏页（用户收藏的诗词）
│   ├── lib/
│   │   └── supabase.js      # Supabase 客户端配置
│   └── App.jsx              # 主应用组件（路由配置）
├── database.sql             # 数据库初始化脚本
├── package.json             # 项目依赖配置
└── vite.config.js          # Vite 构建配置
```

## 功能说明

### 页面列表

1. **首页 (/)** 
   - 展示热门诗词（按浏览量排序）
   - 搜索功能（搜索诗词标题或内容）
   - 著名诗人列表

2. **诗词详情页 (/poem/:id)**
   - 完整诗词内容展示
   - 诗词赏析
   - 译文
   - 评论功能
   - 收藏/取消收藏
   - 浏览量统计

3. **作者详情页 (/author/:id)**
   - 作者基本信息（姓名、朝代、生卒年）
   - 人物简介
   - 该作者的所有作品列表

4. **收藏页 (/collection)**
   - 用户收藏的诗词列表
   - 取消收藏功能

### 数据库表说明

#### 1. authors（作者表）
存储诗人的基本信息。

#### 2. poems（诗词表）
存储诗词内容，包含：
- 标题、内容
- 赏析、译文
- 浏览量统计

#### 3. collections（收藏表）
存储用户的收藏记录。

#### 4. comments（评论表）
存储用户对诗词的评论。

## 常见问题

### Q: 为什么看不到数据？
A: 确保已经执行了 `database.sql` 脚本创建表和示例数据。

### Q: 无法连接 Supabase？
A: 检查 `.env` 文件中的 URL 和 KEY 是否正确，确保网络连接正常。

### Q: 收藏功能不工作？
A: 确保 Supabase 的 RLS 策略已正确配置（已包含在 database.sql 中）。

### Q: 如何添加更多诗词？
A: 可以通过 Supabase 控制台的 Table Editor 手动添加，或执行 SQL 插入语句。

## 生产部署

构建生产版本：

```bash
npm run build
```

构建后的文件在 `dist/` 目录中，可以部署到：
- Vercel
- Netlify
- 任何静态网站托管服务

部署时记得配置环境变量！

## 技术支持

如有问题，请检查：
1. Supabase 项目是否正常运行
2. 数据库表是否已创建
3. RLS 策略是否正确配置
4. 环境变量是否正确设置

