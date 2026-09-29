# 沪上漫游 · 部署上线指南

本指南面向 `site/` 目录下的静态站点，所有步骤均已在本机实测通过。站点**无需 Node.js、无需构建、无需后端**，可直接部署到任意静态托管平台。

---

## 0. 站点结构

```
site/
├── index.html              页面入口与语义结构（含 SEO / OG 元信息）
├── styles.css              响应式布局、日夜双主题
├── app.js                  日期、详情、清单、明信片保存交互
├── scene.js                Three.js 场景、模型、相机与拾取
├── trip-data.js            行程、地点、票务、来源信息
├── assets-mark.svg         favicon
├── README.md               项目说明与数据边界声明
└── vendor/
    ├── three.min.js        本地 Three.js 0.160.1（MIT）
    └── THREE-LICENSE.txt   Three.js 许可证
```

**关键特性**：全部运行资源本地化，无任何外部 CDN 依赖（除用户主动点击的官方来源链接）。这意味着部署后**离线可用**，也不存在第三方 CDN 被墙或变更导致的线上故障。

---

## 1. 本地预览（部署前必做）

### 方式 A：Python 一行命令（推荐用于验证）

```bash
cd site
python -m http.server 8849 --bind 127.0.0.1
```

浏览器打开 <http://127.0.0.1:8849/>。

> 注意 `--bind 127.0.0.1`：只监听本机，避免把开发服务暴露到局域网。

### 方式 B：Node 一行命令

```bash
cd site
npx --yes serve -l 8849 .
```

### 方式 C：直接双击

`index.html` 可直接双击打开。但**建议用 A 或 B**，因为 `file://` 协议下浏览器对本地资源加载有额外限制，且部分功能（如剪贴板、全屏）行为不一致。

### 验证清单

打开后逐项确认：

| 检查项 | 预期结果 |
| --- | --- |
| 3D 沙盘 | 出现城市沙盘与地标标签，无「无法显示 3D」提示 |
| 加载遮罩 | 「正在搭建你的上海」自动消失 |
| 左侧时间线 | 「全程」视图下渲染 3 天分组、共 9 个停留点 |
| 点击地标 | 沙盘下方详情面板内容随之更新 |
| 日期切换 | 点 10.03／10.04／10.05 后路线与时间线同步变化 |
| 日夜景 | 右上角「夜景」按钮切换主题色 |
| 出发清单 | 右上角按钮弹出清单，勾选后刷新页面仍保留 |
| 明信片 | 「存张明信片」下载一张带标题的 PNG |
| 窄屏布局 | 窗口拖窄至 900px 以下，出现底部导航 |

浏览器需支持 WebGL。若设备不支持，页面会降级：行程与清单仍可用，仅 3D 部分提示不可用——这是**预期行为**，不是 bug。

---

## 2. 部署方案选择

| 平台 | 免费额度 | 自定义域名 | 适合场景 |
| --- | --- | --- | --- |
| **Cloudflare Pages** | 无限流量 | 支持 | 首选，全球 CDN，国内可访问性较好 |
| **Vercel** | 较充足 | 支持 | 体验最好，但国内访问偶有不稳 |
| **Netlify** | 较充足 | 支持 | Drag & Drop 最省事 |
| **GitHub Pages** | 1GB / 100GB 月流量 | 支持 | 有 GitHub 仓库时最方便 |
| **腾讯云 COS / 对象存储** | 按量计费 | 支持 | 面向国内用户，需备案 |

> **如果是给国内亲友看的旅行手册**：优先考虑国内对象存储 + 备案域名，或 Cloudflare Pages（无需备案，国内多数地区可访问）。
> **如果只是临时分享**：Netlify Drop 最省事，30 秒上线。

---

## 3. 方案一：Netlify Drop（最快，30 秒）

无需 Git、无需命令行。

1. 打开 <https://app.netlify.com/drop>
2. 把 **`site` 文件夹本体**拖进页面（重要：拖文件夹，不是拖里面的文件）
3. 等待上传，得到形如 `https://xxx-yyy-123.netlify.app` 的网址
4. 点击 `Site configuration → Change site name` 改成好记的名字，如 `shanghai-pocket-atlas`

**验证**：直接访问该网址，确认 3D 沙盘正常；再用手机访问同一网址，确认移动端布局正常。

---

## 4. 方案二：Cloudflare Pages（推荐长期使用）

> **本项目已就绪**：代码已推送到 `https://github.com/ZhiYunKe/map.git`（分支 `main`），
> 可直接从下面第 2 步开始操作。

### 4.1 通过 Git 自动部署

1. ~~把 `site/` 内容推到 GitHub 仓库~~ —— **已完成**，仓库为 `ZhiYunKe/map`，分支 `main`
2. 登录 <https://dash.cloudflare.com/> → 左侧 `Workers & Pages` → `Create` → 选 `Pages` 标签 → `Connect to Git`
3. 首次使用需授权 Cloudflare 访问 GitHub：选 `Only select repositories`，只勾选 `map` 这一个仓库（最小权限原则）
4. 选择仓库 `map`，配置构建参数：

   | 配置项 | 值 |
   | --- | --- |
   | Project name | `shanghai-atlas`（或你喜欢的名字，决定最终域名） |
   | Production branch | `main` |
   | Framework preset | `None` |
   | Build command | *（留空，不要填任何内容）* |
   | Build output directory | `/` |
   | Root directory | *（留空）* |
   | Environment variables | *（不需要）* |

5. 点 `Save and Deploy`，约 30 秒后得到 `https://<Project name>.pages.dev`
6. 之后本地改完内容，`git add . && git commit -m "更新" && git push`，Cloudflare 自动重新部署

> **关键提醒**：`Build command` 必须**留空**。本项目是纯静态站点，
> 若填了 `npm run build` 之类的命令会因找不到 `package.json` 而构建失败。

### 4.2 通过命令行直传（无需 Git）

```bash
npm install -g wrangler
wrangler login
cd site
wrangler pages deploy . --project-name shanghai-atlas
```

### 4.2 通过命令行直传（无需 Git）

```bash
npm install -g wrangler
wrangler login
cd site
wrangler pages deploy . --project-name shanghai-atlas
```

**绑定自定义域名**：`Pages 项目 → Custom domains → Set up a custom domain`，按提示在 DNS 添加 CNAME 记录。Cloudflare 会自动签发 SSL 证书。

### 4.3 上线后验证

部署完成会拿到形如 `https://shanghai-atlas.pages.dev` 的网址。打开后确认：

- 3D 沙盘正常渲染（不是「无法显示 3D」的降级提示）
- 手机访问时底部出现三项导航
- 控制台无报错（F12 → Console）

分享给朋友时提醒一句：**若在微信里打开是空白，点右上角「…」→ 在浏览器中打开**。微信内置浏览器对 WebGL 限制较多。

---

## 5. 方案三：GitHub Pages

```bash
cd site
git init
git add .
git commit -m "Add Shanghai Pocket Atlas"
git branch -M main
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main
```

然后 `仓库 → Settings → Pages`：

- **Source**: `Deploy from a branch`
- **Branch**: `main`，目录选 `/ (root)`
- 保存后等待约 1 分钟

访问 `https://<用户名>.github.io/<仓库名>/`。

> **注意**：仓库根目录需直接包含 `index.html`。若把整个 `site/` 文件夹推上去，网址会变成 `.../<仓库名>/site/`。想避免这点，把 `site/` 里的内容直接推为仓库根目录。

---

## 6. 方案四：Vercel

```bash
npm install -g vercel
cd site
vercel          # 首次会引导登录与创建项目
vercel --prod   # 部署到生产环境
```

配置回答：`Set up and deploy?` → `Y`；`Which scope?` → 选你的账号；`Link to existing project?` → `N`；`Project name` → 自取；`Directory` → `./`；`Override settings?` → `N`。

---

## 7. 部署后检查清单

上线后务必逐项复核：

- [ ] **首屏**：3D 沙盘正常渲染，无控制台报错（F12 → Console 应为空）
- [ ] **移动端**：真机访问，底部导航可切换「探索沙盘／每日行程／出发清单」
- [ ] **横向溢出**：手机上左右滑动不应出现横向滚动条
- [ ] **清单持久化**：勾选后刷新页面，进度仍在
- [ ] **外链**：点击「地图导航」「信息来源」能正常跳转（这些是外部链接，需联网）
- [ ] **图标**：浏览器标签页显示自定义 favicon，不是默认空白页图标
- [ ] **分享卡片**：把网址发给微信／社交平台，标题与描述显示正常

### 常见问题

| 现象 | 原因与处理 |
| --- | --- |
| 页面 404 | 部署根目录不对。确认 URL 指向的层级里能直接找到 `index.html` |
| 沙盘黑屏 / 提示不支持 3D | 设备或浏览器 WebGL 被禁用。属降级路径，行程功能仍可用；可换 Chrome／Edge 验证 |
| 样式全丢、页面是纯文本 | `styles.css` 路径 404。确认 `vendor/` 与各资源文件都上传成功 |
| 中文乱码 | 服务器未声明 UTF-8。本项目 HTML 已含 `<meta charset="UTF-8">`，若仍有问题检查服务器响应头 |
| 微信内打开白屏 | 微信内置浏览器对 WebGL 限制较多。引导用户点右上角「在浏览器中打开」 |
| 清单进度丢失 | 进度存在 `localStorage`，清理站点数据、换浏览器或隐身模式都会清空，属预期行为 |

---

## 8. 更新与回滚

**内容更新**：直接改 `site/trip-data.js`（行程、地点、票务文本都在这里，结构清晰），重新部署即可。表单式数据结构，无需改动逻辑代码。

**回滚**：
- Netlify / Cloudflare / Vercel：控制台的 Deployments 列表里，对任一历史版本点 `Rollback` 或 `Publish`
- GitHub Pages：`git revert <commit>` 后 push

---

## 9. 数据边界声明（请勿删除）

站点内的 `README.md` 与页面「信息来源」弹窗已明确声明：

- 这是**非等比例的艺术化行程沙盘**，不是测绘地图
- 建筑高度、街区、河道、位置间距与路线连线均为**视觉示意**，不代表实际轨道走向
- 乘车、候车、排队时间为**规划预留**，未接入实时公交／票务／航班服务
- 预约规则以出行时官方公告为准

这些声明是站点可信度的一部分，**上线时建议保留**。若需接入真实地图，应改用合规的地图服务（腾讯地图／高德地图／百度地图／天地图），不要使用未经批准的境外地图数据源。
