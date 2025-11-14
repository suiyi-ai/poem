# Netlify 部署检查清单

在部署到 Netlify 之前，请确认以下事项：

## ✅ 代码准备

- [ ] 代码已推送到 Git 仓库（GitHub/GitLab/Bitbucket）
- [ ] `netlify.toml` 文件已存在
- [ ] `public/_redirects` 文件已存在
- [ ] 本地构建测试通过：`npm run build`

## ✅ Supabase 配置

- [ ] Supabase 项目已创建
- [ ] 数据库表已创建（执行了 `database.sql`）
- [ ] 已获取 Supabase URL 和 anon key
- [ ] Supabase RLS 策略已正确配置（允许匿名读取）

## ✅ Netlify 配置

- [ ] 已登录 Netlify 账号
- [ ] 已创建新站点并连接 Git 仓库
- [ ] 环境变量已设置：
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] 构建设置已确认：
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
  - [ ] Node version: 18

## ✅ 部署后验证

部署完成后，请测试：

- [ ] 首页正常加载
- [ ] 路由正常工作（如 `/poem/:id`、`/author/:id`）
- [ ] 数据从 Supabase 正常加载
- [ ] 搜索功能正常
- [ ] 收藏功能正常
- [ ] 评论功能正常（如果已实现）
- [ ] 移动端显示正常

## 🔧 如果遇到问题

1. 查看 Netlify 构建日志
2. 检查浏览器控制台错误
3. 参考 [NETLIFY_DEPLOY.md](./NETLIFY_DEPLOY.md)
4. 参考 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📝 环境变量示例

在 Netlify 控制台设置以下环境变量：

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**注意**：环境变量必须以 `VITE_` 开头，这样 Vite 才会在构建时将其注入到客户端代码中。

