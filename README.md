# Sealos Brain UI

[中文](#中文) | [English](#english)

## 中文

这是 Sealos Brain 首页的前端复刻项目。静态视觉以用户提供的 `2880x12912` 设计稿为唯一基准，动画节奏参考[交互原型](https://sealos-brain-homepage-8c88c619.usw-1.sealos.app/)。页面包含 Deploy、故障修复、AI Proxy、Skills、App Store、Scale 六个区块。

当前发布版本为 `v1.1.0`。线上演示已部署到 [Sealos Cloud](https://sealos-brain-ui-dinkkees.sealoshzh.site)，对应公开镜像为 `ghcr.io/tony-xuyang/sealos-brain-ui:20260826-104517`。

### 本地运行

要求 Node.js 22 或更高版本。

```bash
npm ci
npm run dev
```

生产构建和预览：

```bash
npm run build
npm run preview
```

默认生产预览地址为 `http://127.0.0.1:4173`。

### 自动化测试

首次运行需安装 Playwright Chromium：

```bash
npx playwright install chromium
npm run test:e2e
```

测试覆盖：

- 六个区块、站内锚点与 `1440x6456` 桌面几何基线
- 部署状态流、问题分类切换、AI/Skills 动效结构和 App Store 交互
- Scale 数字动画与移动菜单
- 桌面 `1280x720`、移动端 `390x844` 的断图、横向溢出、文字溢出、控制台错误和严重可访问性问题

验收截图：

- `docs/screenshots/desktop.png` (`1440x6456`)
- `docs/screenshots/mobile.png` (`390x9930`)

### 容器

```bash
docker build -t sealos-brain-ui:local .
docker run --rm -p 8080:8080 sealos-brain-ui:local
```

容器使用 Node.js 22 多阶段构建和非 root Nginx 静态运行时，健康检查地址为 `/healthz`。

### 项目边界

这是前端交互演示。部署、AI 修复、模型连接和应用安装均由浏览器端状态机模拟，不连接真实 Sealos 业务 API，也不需要数据库、Secret 或环境变量。

完整验收结果见 [TEST_REPORT.md](TEST_REPORT.md)，交接步骤见 [HANDOFF.md](HANDOFF.md)。

## English

This project reproduces the Sealos Brain homepage. The user-provided `2880x12912` design image is the sole static visual reference, while animation timing follows the [interactive prototype](https://sealos-brain-homepage-8c88c619.usw-1.sealos.app/). The page contains Deploy, issue repair, AI Proxy, Skills, App Store, and Scale sections.

The current release is `v1.1.0`. The accepted build is live on [Sealos Cloud](https://sealos-brain-ui-dinkkees.sealoshzh.site) and uses the public image `ghcr.io/tony-xuyang/sealos-brain-ui:20260826-104517`.

### Local development

Node.js 22 or later is required.

```bash
npm ci
npm run dev
```

Production build and preview:

```bash
npm run build
npm run preview
```

The default production preview URL is `http://127.0.0.1:4173`.

### Automated tests

Install Playwright Chromium once, then run the suite:

```bash
npx playwright install chromium
npm run test:e2e
```

Coverage includes:

- Six sections, in-page anchors, and the `1440x6456` desktop geometry baseline
- Deployment state flow, issue category switching, AI/Skills animation structure, and App Store interactions
- Scale counters and mobile navigation
- Broken assets, horizontal and text overflow, console errors, and serious accessibility findings at desktop `1280x720` and mobile `390x844`

Acceptance screenshots:

- `docs/screenshots/desktop.png` (`1440x6456`)
- `docs/screenshots/mobile.png` (`390x9930`)

### Container

```bash
docker build -t sealos-brain-ui:local .
docker run --rm -p 8080:8080 sealos-brain-ui:local
```

The image uses a Node.js 22 multi-stage build and a non-root Nginx static runtime. Its health endpoint is `/healthz`.

### Scope

This is an interactive frontend demonstration. Deployment, AI repair, model connections, and app installation are browser-side state machines; they do not call real Sealos business APIs. No database, Secret, or environment variable is required.

See [TEST_REPORT.md](TEST_REPORT.md) for acceptance results and [HANDOFF.md](HANDOFF.md) for handoff steps.
