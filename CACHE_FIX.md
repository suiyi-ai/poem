# 解决浏览器缓存问题

## 问题描述
打开 http://localhost:3000 时显示旧的页面（如"诗光-诗词推荐发现APP"），需要强制刷新才能看到新内容。

## 原因
浏览器缓存了旧版本的页面，包括：
- HTML文件缓存
- Service Worker缓存
- 浏览器本地缓存

## 解决方案

### 方案1：使用清除缓存工具（推荐）
访问：http://localhost:3000/clear-cache.html
点击"清除所有"按钮

### 方案2：开发者工具禁用缓存（最佳开发体验）
1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签
3. **勾选 "Disable cache"**
4. 保持开发者工具打开

这样修改代码后会自动加载最新版本，无需手动刷新。

### 方案3：手动清除浏览器缓存
- **Chrome/Edge**: Ctrl + Shift + Delete
- 选择"所有时间"
- 勾选"缓存的图片和文件"和"Cookie及其他网站数据"
- 点击"清除数据"

### 方案4：硬刷新
- Windows: `Ctrl + Shift + R` 或 `Ctrl + F5`
- Mac: `Cmd + Shift + R`

## 预防措施

已在 `index.html` 中添加：
- 自动清除 Service Worker 的脚本
- 自动清除缓存 API 的脚本
- 禁用缓存的 meta 标签

新访问页面时会自动清除旧的缓存。

## 测试
清除缓存后：
1. 访问 http://localhost:3000
2. 应该看到"诗词赏析"的 React 应用
3. 修改代码后应该自动更新（如果开启了 Disable cache）

