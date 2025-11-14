# 诗词赏析网站

一个基于 React + Vite + Supabase 的现代化诗词赏析平台，提供诗词浏览、赏析、评论和收藏功能。

## 功能特点

- 📜 **诗词浏览**：浏览热门诗词，按作者分类
- 🔍 **搜索功能**：快速搜索诗词和作者
- 📖 **详细赏析**：每首诗词包含完整内容、赏析和译文
- 💬 **评论互动**：用户可以发表评论，分享感受
- ⭐ **收藏功能**：收藏喜欢的诗词，随时查看
- 👤 **作者展示**：查看作者信息和作品列表

## 技术栈

- **前端框架**：React 18
- **构建工具**：Vite
- **路由**：React Router v6
- **后端服务**：Supabase (PostgreSQL + 实时API)
- **样式**：CSS3 (渐变、动画、响应式设计)

## 项目结构

```
poem/
├── src/
│   ├── components/          # 公共组件
│   │   ├── Navbar.jsx       # 导航栏
│   │   └── Navbar.css
│   ├── pages/               # 页面组件
│   │   ├── Home.jsx         # 首页
│   │   ├── PoemDetail.jsx   # 诗词详情页
│   │   ├── AuthorDetail.jsx # 作者详情页
│   │   └── Collection.jsx   # 收藏页
│   ├── lib/
│   │   └── supabase.js      # Supabase 客户端配置
│   ├── App.jsx              # 主应用组件
│   ├── App.css
│   ├── main.jsx             # 入口文件
│   └── index.css            # 全局样式
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 数据库设计

### 1. `authors` 表（作者表）
```sql
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  dynasty VARCHAR(50) NOT NULL,
  birth_year INTEGER,
  death_year INTEGER,
  biography TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. `poems` 表（诗词表）
```sql
CREATE TABLE poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  appreciation TEXT,
  translation TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. `collections` 表（收藏表）
```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(100) NOT NULL,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, poem_id)
);
```

### 4. `comments` 表（评论表）
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  user_id VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

1. 在 [Supabase](https://supabase.com) 创建一个新项目
2. 在 Supabase SQL Editor 中执行上述 SQL 语句创建表
3. 创建 `increment_views` 函数（用于增加浏览量）：

```sql
CREATE OR REPLACE FUNCTION increment_views(poem_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE poems SET views = views + 1 WHERE id = poem_id;
END;
$$ LANGUAGE plpgsql;
```

4. 复制 `.env.example` 为 `.env`，填入你的 Supabase 项目信息：

```bash
cp .env.example .env
```

编辑 `.env` 文件：
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

**⚠️ 重要提示**：
- **必须通过 Vite 开发服务器运行**，不要直接双击打开 `index.html` 文件
- 直接打开 HTML 文件会导致 MIME 类型错误，因为浏览器无法处理 ES 模块和 JSX
- 如果遇到 MIME 类型错误，请查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### 4. 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist/` 目录中。

### 5. 部署到 Netlify

详细部署指南请查看 [NETLIFY_DEPLOY.md](./NETLIFY_DEPLOY.md)

**快速部署步骤：**

1. 将代码推送到 Git 仓库（GitHub/GitLab/Bitbucket）
2. 在 [Netlify](https://app.netlify.com) 创建新站点
3. 连接 Git 仓库
4. 配置环境变量：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. 点击部署（Netlify 会自动检测 `netlify.toml` 配置）

## 导入示例数据

在 Supabase SQL Editor 中执行以下 SQL 导入示例数据：

```sql
-- 插入作者
INSERT INTO authors (name, dynasty, birth_year, death_year, biography) VALUES
('李白', '唐', 701, 762, '李白，字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。'),
('杜甫', '唐', 712, 770, '杜甫，字子美，自号少陵野老，唐代伟大的现实主义诗人，被后人誉为"诗圣"。'),
('苏轼', '宋', 1037, 1101, '苏轼，字子瞻，号东坡居士，北宋著名文学家、书法家、画家。');

-- 插入诗词
INSERT INTO poems (title, content, author_id, appreciation, translation) VALUES
('静夜思', '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。', 
 (SELECT id FROM authors WHERE name = '李白'),
 '这首诗写的是在寂静的月夜思念家乡的感受。诗人通过"疑是地上霜"这一形象的比喻，写出了月光的皎洁，也表现了季节的寒冷。',
 '明亮的月光洒在床前的窗户纸上，好像地上泛起了一层霜。我禁不住抬起头来，看那天窗外空中的明月，不由得低头沉思，想起远方的家乡。'),
('春晓', '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
 (SELECT id FROM authors WHERE name = '李白'),
 '这首诗是诗人隐居在鹿门山时所作，描写了春天早晨醒来时的情景。诗人抓住春天的早晨刚刚醒来时的一瞬间展开描写和联想，生动地表达了诗人对春天的热爱和怜惜之情。',
 '春日里贪睡不知不觉天已破晓，搅乱我酣眠的是那啁啾的小鸟。昨天夜里风声雨声一直不断，那娇美的春花不知被吹落了多少？');
```

## 页面说明

### 首页 (/)
- 展示热门诗词
- 搜索功能
- 著名诗人列表

### 诗词详情页 (/poem/:id)
- 完整诗词内容
- 诗词赏析
- 译文
- 评论功能
- 收藏功能

### 作者详情页 (/author/:id)
- 作者基本信息
- 人物简介
- 代表作品列表

### 收藏页 (/collection)
- 用户收藏的诗词列表
- 取消收藏功能

## 常见问题

### MIME 类型错误
如果遇到 "Failed to load module script" 错误，请查看 [故障排除指南](./TROUBLESHOOTING.md)。

**快速解决**：确保使用 `npm run dev` 启动开发服务器，不要直接打开 HTML 文件。

## 注意事项

- 本项目使用 localStorage 存储用户ID（简化版用户系统）
- 生产环境建议使用 Supabase Auth 实现真正的用户认证
- 确保 Supabase 表的 RLS (Row Level Security) 策略配置正确，允许匿名读取
- **必须通过开发服务器运行**，不支持直接打开 HTML 文件

## License

MIT

