# ML API Proxy - Vercel 部署指南

## 方法一：通过 GitHub 部署（推荐，最简单）

### Step 1: 上传到 GitHub
1. 打开 https://github.com/new 创建新仓库
2. 仓库名: `ml-api-proxy`，选 Public
3. 点 "Create repository"
4. 点 "uploading an existing file"
5. 把这个文件夹里的所有文件拖进去上传
6. 点 "Commit changes"

### Step 2: 部署到 Vercel
1. 打开 https://vercel.com/ 用 GitHub 账号登录
2. 点 "Add New Project"
3. 选择刚才创建的 `ml-api-proxy` 仓库
4. 直接点 "Deploy"（不需要改任何设置）
5. 等 30 秒部署完成
6. 你会得到一个 URL，类似: `https://ml-api-proxy-xxx.vercel.app`

### Step 3: 使用
把 Vercel URL 粘贴到选品工具的 "Worker URL" 框里，点测试连接即可

---

## 方法二：通过 Vercel CLI 部署

1. 安装 Node.js: https://nodejs.org/
2. 安装 Vercel CLI: `npm i -g vercel`
3. 在此文件夹打开终端，运行: `vercel`
4. 按提示登录、确认部署
5. 得到 URL 后粘贴到工具里

---

## 文件说明
- `api/[...path].js` - 代理函数，转发请求到 api.mercadolibre.com
- `vercel.json` - URL 路由配置
- `package.json` - 项目配置
- `public/index.html` - 测试页面
