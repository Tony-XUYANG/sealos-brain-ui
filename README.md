# Sealos Brain UI

[中文](#中文) | [English](#english)

## 中文

这是 Sealos Brain 首页原型的像素级前端复刻，视觉以[已发布原型](https://sealos-brain-homepage-8c88c619.usw-1.sealos.app/)为设计基准，包含项目部署、AI Ops、AI Proxy、Skills、App Store 和 Scale 六个区块及其动效与交互。

线上演示：[https://sealos-brain-ui-dinkkees.sealoshzh.site](https://sealos-brain-ui-dinkkees.sealoshzh.site)

### 本地运行

要求 Node.js 22 或更高版本。

```bash
npm ci
npm run dev
```

默认开发地址由 Vite 输出。生产构建与预览：

```bash
npm run build
npm run preview
```

生产预览地址为 `http://127.0.0.1:4173`。

### 自动化测试

首次运行需要安装 Chromium：

```bash
npx playwright install chromium
npm run test:e2e
```

测试会自动构建生产包并在 `1280x720` 与 `390x844` 下验证六个区块、锚点、暂停控制、AI Ops 场景切换、App Store、数字动画、移动菜单、布局溢出、严重可访问性问题和浏览器运行时错误。

### 容器

```bash
docker build -t sealos-brain-ui:local .
docker run --rm -p 8080:8080 sealos-brain-ui:local
```

容器使用 Node.js 22 多阶段构建和非 root Nginx 静态运行时，健康检查地址为 `/healthz`。

### 项目边界

这是前端交互演示。部署、AI 修复、模型连接和应用安装流程均由浏览器端状态机模拟，不连接真实 Sealos 业务 API，也不需要数据库、Secret 或环境变量。

交接与验收细节见 [TEST_REPORT.md](TEST_REPORT.md)。

## English

This repository is a pixel-faithful frontend reproduction of the Sealos Brain homepage prototype. The [published prototype](https://sealos-brain-homepage-8c88c619.usw-1.sealos.app/) is the visual source of truth. It includes the animated Deploy, AI Ops, AI Proxy, Skills, App Store, and Scale sections.

Live demo: [https://sealos-brain-ui-dinkkees.sealoshzh.site](https://sealos-brain-ui-dinkkees.sealoshzh.site)

### Local development

Node.js 22 or later is required.

```bash
npm ci
npm run dev
```

For a production build and local preview:

```bash
npm run build
npm run preview
```

The production preview is served at `http://127.0.0.1:4173`.

### Automated tests

Install Chromium once, then run the suite:

```bash
npx playwright install chromium
npm run test:e2e
```

The suite builds the production bundle and checks both `1280x720` and `390x844` viewports for all six sections, anchors, pause controls, AI Ops switching, App Store selection, animated counters, the mobile menu, layout overflow, serious accessibility issues, and browser runtime errors.

### Container

```bash
docker build -t sealos-brain-ui:local .
docker run --rm -p 8080:8080 sealos-brain-ui:local
```

The image uses a Node.js 22 multi-stage build and a non-root Nginx static runtime. Its health endpoint is `/healthz`.

### Scope

This is an interactive frontend demonstration. Deployment, AI repair, model connection, and app installation flows are browser-side state machines; they do not call real Sealos business APIs. No database, Secret, or environment variable is required.

See [TEST_REPORT.md](TEST_REPORT.md) for handoff and acceptance details.
