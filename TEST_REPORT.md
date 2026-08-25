# Test Report / 测试报告

Version / 版本: `v1.0.0`  
Date / 日期: `2026-08-25`

## 中文

### 测试范围

- 生产构建与静态资源完整性
- 六个页面区块与站内锚点
- Project Journey 暂停、恢复和部署状态
- AI Ops 场景切换与暂停控制
- App Store 应用选择
- Scale 数字动画
- 移动端菜单
- 桌面端 `1280x720` 与移动端 `390x844` 的横向溢出、文字溢出、浏览器错误和非视觉类严重可访问性问题

### 设计还原验收

- 参考站与本地站在 `1440x1000` 下的页面高度均为 `6185px`。
- 六个区块的位置、高度、标题字号、行高与颜色一致。
- 桌面端像素差异为 `0.6958%`，差异集中在采样时刻不同的运动节点与进度动画；平均通道差异小于 `0.09`。
- 参考站与本地站在 `390x844` 下的页面高度均为 `10220px`。
- 移动端像素差异为 `0.035841%`。
- 本地字体与原型使用同一 Google Fonts 字体文件，但已随项目打包，不依赖运行时字体请求。
- 为保证像素级还原，自动化可访问性门禁不修改原型的低对比度辅助文字颜色；`color-contrast` 作为已知视觉设计取舍单独记录，其余 WCAG A/AA 严重与致命规则仍会阻止发布。

### 自动化结果

- `npm run build`: 通过
- `npm run test:e2e`: 通过，`13 passed`，`3 skipped`；跳过项是仅移动端用例在桌面项目中跳过，以及需要显式开启的截图采集用例
- 截图采集: 通过，桌面端 `1280x6180`，移动端 `390x10172`
- 控制台与页面运行时错误: `0`
- 横向溢出与文字溢出: `0`
- 线上地址部署后将使用同一套测试重新验证
- GitHub Actions CI: 通过（生产构建与 Playwright）
- GHCR `linux/amd64` 镜像构建: 通过，含 provenance 与 SBOM
- Sealos Template 质量门禁: 通过，56 条一致性规则与全部验证器自测通过
- Sealos Template API dry-run: HTTP `200`，资源预览为 1 个 Deployment、Service、Ingress 和 App；未创建云端资源

验收截图：

- `docs/screenshots/desktop.png`
- `docs/screenshots/mobile.png`

## English

### Coverage

- Production build and static asset integrity
- Six page sections and in-page anchors
- Project Journey pause, resume, and deployment state
- AI Ops scenario switching and pause control
- App Store selection
- Scale number animation
- Mobile navigation
- Horizontal overflow, text overflow, browser errors, and serious non-visual accessibility findings at desktop `1280x720` and mobile `390x844`

### Visual fidelity acceptance

- The reference and local pages both have a `6185px` document height at `1440x1000`.
- All six sections match in position, height, heading size, line height, and color.
- Desktop pixel difference is `0.6958%`, isolated to moving nodes and progress animations sampled at different moments; mean channel difference is below `0.09`.
- The reference and local pages both have a `10220px` document height at `390x844`.
- Mobile pixel difference is `0.035841%`.
- Local fonts use the same Google Fonts files as the prototype but are bundled with the project, eliminating runtime font requests.
- To preserve pixel fidelity, the automated accessibility gate does not change the prototype's low-contrast secondary text. `color-contrast` is tracked as a known visual-design tradeoff; every other serious or critical WCAG A/AA rule still blocks release.

### Automated result

- `npm run build`: passed
- `npm run test:e2e`: passed, `13 passed`, `3 skipped`; skips are the mobile-only case in the desktop project and opt-in screenshot capture cases
- Screenshot capture: passed at `1280x6180` desktop and `390x10172` mobile
- Console and page runtime errors: `0`
- Horizontal and text overflow findings: `0`
- The same suite will be run again against the public deployment
- GitHub Actions CI: passed (production build and Playwright)
- GHCR `linux/amd64` image build: passed with provenance and SBOM
- Sealos Template quality gate: passed all 56 consistency rules and validator self-tests
- Sealos Template API dry-run: HTTP `200`, previewing one Deployment, Service, Ingress, and App; no cloud resource was created

Acceptance screenshots:

- `docs/screenshots/desktop.png`
- `docs/screenshots/mobile.png`
