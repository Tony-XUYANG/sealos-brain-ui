# Handoff Guide / 交接指南

Version / 版本: `v1.0.0`

## 中文

### 接收方快速验收

```bash
git clone https://github.com/Tony-XUYANG/sealos-brain-ui.git
cd sealos-brain-ui
npm ci
npm run dev
```

生产验收：

```bash
npm run build
npx playwright install chromium
npm run test:e2e
```

### 交付内容

- `main`：稳定交付分支
- `v1.0.0`：首个正式交付标签与 Release
- `README.md`：开发、构建、测试和容器说明
- `TEST_REPORT.md`：视觉、交互、布局和运行时验收结果
- `docs/screenshots/`：桌面端与移动端全页截图
- `.sealos/template/`：Sealos Template 与图标
- `deploy/deployment.log`：部署阶段记录

### 维护边界

页面是前端交互原型。Project Journey、AI Ops、AI Proxy、Skills 和 App Store 的流程由 `script.js` 中的浏览器状态机驱动；它们不会创建真实云资源或调用真实业务 API。

更新 UI 后先执行 `npm run test:e2e`，再构建新镜像并更新 Sealos Deployment。回滚使用上一个 GHCR 镜像标签或 Kubernetes rollout history，不要覆盖旧镜像标签。

## English

### Recipient quick verification

```bash
git clone https://github.com/Tony-XUYANG/sealos-brain-ui.git
cd sealos-brain-ui
npm ci
npm run dev
```

Production acceptance:

```bash
npm run build
npx playwright install chromium
npm run test:e2e
```

### Delivered artifacts

- `main`: stable delivery branch
- `v1.0.0`: first production handoff tag and GitHub Release
- `README.md`: development, build, test, and container instructions
- `TEST_REPORT.md`: visual, interaction, layout, and runtime acceptance results
- `docs/screenshots/`: desktop and mobile full-page screenshots
- `.sealos/template/`: Sealos Template and icon
- `deploy/deployment.log`: deployment phase record

### Maintenance boundary

This page is an interactive frontend prototype. Project Journey, AI Ops, AI Proxy, Skills, and App Store flows are browser state machines in `script.js`; they do not create real cloud resources or call production business APIs.

After a UI update, run `npm run test:e2e` before building a new image and updating the Sealos Deployment. Roll back to a previous immutable GHCR tag or Kubernetes rollout revision; never overwrite an existing image tag.
