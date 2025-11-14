# 故障排除指南

## MIME 类型错误

### 错误信息
```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "application/octet-stream". Strict MIME type checking is enforced for module scripts per HTML spec.
```

### 原因
这个错误通常发生在以下情况：

1. **直接打开 HTML 文件**：双击 `index.html` 或使用 `file://` 协议打开
   - 浏览器无法正确处理 ES 模块（`type="module"`）
   - 无法识别 `.jsx` 文件扩展名
   - 没有正确的 MIME 类型配置

2. **使用了不兼容的服务器**：使用 Python 的 `SimpleHTTPServer` 或其他没有正确配置 MIME 类型的服务器

### 解决方案

#### ✅ 正确方式：使用 Vite 开发服务器

**必须通过 Vite 开发服务器运行项目：**

```bash
npm run dev
```

这会：
- 自动启动开发服务器（默认端口 3000）
- 正确处理 `.jsx` 和 `.js` 文件的 MIME 类型
- 提供热模块替换（HMR）功能
- 自动在浏览器中打开应用

访问地址：`http://localhost:3000`

#### ❌ 错误方式：不要这样做

- ❌ 不要直接双击 `index.html` 文件
- ❌ 不要使用 `file://` 协议打开
- ❌ 不要使用 `python -m http.server`（除非配置了正确的 MIME 类型）

### 如果必须使用其他服务器

如果你必须使用其他服务器（如生产环境），需要确保服务器配置了正确的 MIME 类型：

#### Nginx 配置示例
```nginx
location ~ \.(js|jsx|mjs)$ {
    add_header Content-Type application/javascript;
}
```

#### Apache 配置示例
在 `.htaccess` 文件中添加：
```apache
<IfModule mod_mime.c>
    AddType application/javascript js jsx mjs
</IfModule>
```

### 检查步骤

1. **确认开发服务器正在运行**
   ```bash
   # 检查端口 3000 是否被占用
   netstat -ano | findstr :3000
   ```

2. **确认访问地址正确**
   - 开发环境：`http://localhost:3000`
   - 不要使用 `file://` 协议

3. **清除浏览器缓存**
   - 按 `Ctrl + Shift + Delete` 清除缓存
   - 或使用无痕模式测试

4. **检查控制台错误**
   - 打开浏览器开发者工具（F12）
   - 查看 Console 和 Network 标签页
   - 确认文件加载状态和 MIME 类型

### 常见问题

**Q: 为什么不能直接打开 HTML 文件？**
A: 因为这是一个使用 ES 模块和 JSX 的 React 应用，需要 Vite 进行转换和模块处理。浏览器无法直接执行 JSX 代码。

**Q: 端口 3000 被占用怎么办？**
A: 可以修改 `vite.config.js` 中的端口号，或使用 `release-port.ps1` 脚本释放端口。

**Q: 生产环境如何部署？**
A: 运行 `npm run build` 构建项目，然后将 `dist` 目录部署到支持静态文件的服务（如 Nginx、Apache、Vercel 等）。

