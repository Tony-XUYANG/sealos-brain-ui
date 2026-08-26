# Handoff Guide / 交接指南

Release / 发布版本: `v1.1.0`

## 中文

### 接收方快速验收

```bash
git clone https://github.com/Tony-XUYANG/sealos-brain-ui.git
cd sealos-brain-ui
npm ci
npx playwright install chromium
npm run test:e2e
```

本地查看：

```bash
npm run dev
```

生产预览：

```bash
npm run build
npm run preview
```

### 本轮交付内容

- 以用户设计稿为静态视觉基准的六区块首页
- 参考交互原型实现的连线光点、状态轮播、数字动画和交互反馈
- 本地字体与设计稿提取的产品预览、像素吉祥物和装饰字标
- `tests/ui.spec.js`: 桌面、移动、交互、资源、溢出和可访问性测试
- `TEST_REPORT.md`: 新设计候选版本的量化验收结果
- `docs/screenshots/`: 桌面与移动端全页截图

### 已发布资源

- GitHub: https://github.com/Tony-XUYANG/sealos-brain-ui
- Sealos 演示: https://sealos-brain-ui-dinkkees.sealoshzh.site
- 容器镜像: `ghcr.io/tony-xuyang/sealos-brain-ui:20260826-104517`
- Sealos Deployment: `sealos-brain-ui-uelrpqvt`，工作空间 `ns-fmb1gbvg`
- 自动化与公网验收: 见 `TEST_REPORT.md` 和 `deploy/runtime/`

后续版本应使用新的不可变镜像标签并执行 `kubectl set image`。如新版本 rollout 失败，使用 `kubectl rollout undo deployment/sealos-brain-ui-uelrpqvt -n ns-fmb1gbvg` 回滚。

### 维护边界

页面仍是前端交互演示。Deploy、问题修复、AI Proxy、Skills 和 App Store 由 `script.js` 中的浏览器状态机驱动，不会创建真实云资源或调用真实业务 API。

## English

### Recipient verification

```bash
git clone https://github.com/Tony-XUYANG/sealos-brain-ui.git
cd sealos-brain-ui
npm ci
npx playwright install chromium
npm run test:e2e
```

Local development:

```bash
npm run dev
```

Production preview:

```bash
npm run build
npm run preview
```

### Delivered in this iteration

- A six-section homepage using the user design as the static visual reference
- Route packets, state rotation, counter animation, and interaction feedback based on the interactive prototype
- Bundled fonts and design-derived product previews, pixel mascot, and decorative wordmark
- `tests/ui.spec.js`: desktop, mobile, interaction, asset, overflow, and accessibility checks
- `TEST_REPORT.md`: quantified acceptance results for the new candidate
- `docs/screenshots/`: desktop and mobile full-page screenshots

### Published resources

- GitHub: https://github.com/Tony-XUYANG/sealos-brain-ui
- Sealos demo: https://sealos-brain-ui-dinkkees.sealoshzh.site
- Container image: `ghcr.io/tony-xuyang/sealos-brain-ui:20260826-104517`
- Sealos Deployment: `sealos-brain-ui-uelrpqvt` in workspace `ns-fmb1gbvg`
- Automated and public acceptance: see `TEST_REPORT.md` and `deploy/runtime/`

Future releases should use a new immutable image tag and `kubectl set image`. If a rollout fails, run `kubectl rollout undo deployment/sealos-brain-ui-uelrpqvt -n ns-fmb1gbvg`.

### Maintenance boundary

The page remains an interactive frontend demonstration. Deploy, issue repair, AI Proxy, Skills, and App Store flows are browser state machines in `script.js`; they do not create cloud resources or call production business APIs.
