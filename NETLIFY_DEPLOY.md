# Netlify 部署指南

本指南将帮助你将这个诗词赏析网站部署到 Netlify。

## 前置准备

1. **Supabase 项目已配置**
   - 确保 Supabase 项目已创建
   - 数据库表已创建（执行 `database.sql`）
   - 已获取 API URL 和 anon key

2. **Git 仓库**
   - 将代码推送到 GitHub、GitLab 或 Bitbucket

## 部署步骤

### 方法一：通过 Netlify 网站部署（推荐）

#### 1. 登录 Netlify

访问 [https://app.netlify.com](https://app.netlify.com) 并登录（可以使用 GitHub 账号登录）

#### 2. 创建新站点

1. 点击 **"Add new site"** > **"Import an existing project"**
2. 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
3. 授权 Netlify 访问你的仓库
4. 选择包含此项目的仓库

#### 3. 配置构建设置

Netlify 会自动检测 `netlify.toml` 文件，但请确认以下设置：

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18（或更高）

如果 `netlify.toml` 已存在，这些设置会自动应用。

#### 4. 配置环境变量

在部署设置中，找到 **"Environment variables"** 部分，添加：

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**如何获取这些值：**
1. 登录 Supabase 控制台
2. 进入项目设置：**Settings** > **API**
3. 复制 **Project URL** 和 **anon public** key

#### 5. 部署

点击 **"Deploy site"**，Netlify 将：
1. 安装依赖
2. 运行构建命令
3. 部署到 CDN

部署完成后，你会获得一个类似 `https://your-site-name.netlify.app` 的 URL。

### 方法二：通过 Netlify CLI 部署

#### 1. 安装 Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. 登录 Netlify

```bash
netlify login
```

#### 3. 初始化项目

```bash
netlify init
```

按照提示：
- 选择 "Create & configure a new site"
- 输入站点名称（或使用默认）
- 确认构建命令：`npm run build`
- 确认发布目录：`dist`

#### 4. 设置环境变量

```bash
netlify env:set VITE_SUPABASE_URL "https://your-project-id.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key-here"
```

#### 5. 部署

```bash
netlify deploy --prod
```

## 验证部署

部署完成后，访问你的 Netlify URL，检查：

1. ✅ 首页正常加载
2. ✅ 路由正常工作（如 `/poem/:id`）
3. ✅ 数据从 Supabase 正常加载
4. ✅ 搜索功能正常
5. ✅ 收藏功能正常

## 常见问题

### 1. 构建失败

**问题**：构建过程中出现错误

**解决方案**：
- 检查 Node.js 版本（需要 18+）
- 确保所有依赖已正确安装
- 查看 Netlify 构建日志中的具体错误信息

### 2. 环境变量未生效

**问题**：网站无法连接到 Supabase

**解决方案**：
- 确认环境变量名称正确（必须以 `VITE_` 开头）
- 在 Netlify 控制台检查环境变量是否已设置
- 重新部署站点（环境变量更改后需要重新部署）

### 3. 路由 404 错误

**问题**：直接访问路由（如 `/poem/123`）返回 404

**解决方案**：
- 确认 `public/_redirects` 文件存在
- 确认 `netlify.toml` 中的重定向规则正确
- 重新部署站点

### 4. MIME 类型错误

**问题**：浏览器控制台显示 MIME 类型错误

**解决方案**：
- 这通常不会在 Netlify 上发生，因为 Netlify 自动处理 MIME 类型
- 如果出现，检查构建输出是否正确

## 自定义域名

1. 在 Netlify 控制台进入站点设置
2. 点击 **"Domain settings"**
3. 添加你的自定义域名
4. 按照提示配置 DNS 记录

## 持续部署

一旦连接了 Git 仓库，Netlify 会自动：
- 监听 `main` 或 `master` 分支的推送
- 自动触发构建和部署
- 为每个 Pull Request 创建预览部署

## 性能优化

Netlify 自动提供：
- ✅ CDN 加速
- ✅ 自动 HTTPS
- ✅ 静态资源缓存
- ✅ Gzip 压缩

## 监控和分析

在 Netlify 控制台可以查看：
- 部署历史
- 构建日志
- 访问统计
- 错误日志

## 更新站点

每次推送到主分支，Netlify 会自动重新部署。你也可以：

1. 在 Netlify 控制台手动触发部署
2. 使用 CLI：`netlify deploy --prod`

## 回滚部署

如果需要回滚到之前的版本：

1. 在 Netlify 控制台进入 **"Deploys"** 页面
2. 找到要回滚的部署
3. 点击 **"Publish deploy"**

## 技术支持

如果遇到问题：
1. 查看 Netlify 构建日志
2. 检查浏览器控制台错误
3. 参考 [Netlify 文档](https://docs.netlify.com/)
4. 参考 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

