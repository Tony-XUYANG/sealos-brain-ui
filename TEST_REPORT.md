# Test Report / 测试报告

Candidate / 候选版本: `v1.1.0`
Date / 日期: `2026-08-26`

## 中文

### 测试范围

- 生产构建与静态资源完整性
- 六个页面区块、站内锚点和桌面设计几何基线
- Deploy 状态流、问题分类切换、AI Proxy 与 Skills 动效结构
- Skills 命令复制、App Store 选择与部署状态
- Scale 数字动画和移动菜单
- 桌面 `1280x720` 与移动端 `390x844` 的横向溢出、文字溢出、断图、浏览器错误和严重可访问性问题

### 自动化结果

- `npm run build`: 通过
- `npm run test:e2e`: 通过，`16 passed / 4 conditional skipped`
- 截图采集用例: 通过，`2 passed`
- 控制台错误与页面运行时错误: `0`
- 断图: `0`
- 横向溢出与文字溢出: `0`
- WCAG A/AA 严重或致命问题（不含单独跟踪的颜色对比度）: `0`

条件跳过项为：桌面项目中的移动菜单用例、移动项目中的桌面几何用例，以及默认关闭的两条截图采集用例。

### 视觉验收

设计稿原始尺寸为 `2880x12912`，按 `2x` 像素密度归一化为 `1440x6456`。冻结动画并加载本地字体后进行全页比较：

- 实现截图尺寸: `1440x6456`
- 设计稿归一化尺寸: `1440x6456`
- 平均绝对通道差: `[4.7359, 4.9557, 5.3229] / 255`
- 总体平均绝对差: `5.0048 / 255`
- 最大通道差超过 `10` 的像素: `5.9220%`
- 最大通道差超过 `20` 的像素: `4.1550%`
- 最大通道差超过 `50` 的像素: `2.9300%`

桌面端设计稿是静态视觉验收基准。移动端没有单独设计稿，因此采用响应式、溢出、交互和可访问性验收。

### 验收截图

- `docs/screenshots/desktop.png` (`1440x6456`)
- `docs/screenshots/mobile.png` (`390x9930`)

### 部署状态

本报告验证的是本地设计稿匹配候选版本。现有 Sealos 公网地址仍是先前通过验证的 `v1.0.0`，本轮尚未覆盖部署。待人工验收本地版本后，再构建不可变 GHCR 镜像并更新 Sealos Deployment。

## English

### Coverage

- Production build and static asset integrity
- Six sections, in-page anchors, and the desktop design geometry baseline
- Deploy state flow, issue category switching, and AI Proxy/Skills animation structure
- Skills command copy, App Store selection, and deployment state
- Scale counter animation and mobile navigation
- Horizontal overflow, text overflow, broken assets, browser errors, and serious accessibility findings at desktop `1280x720` and mobile `390x844`

### Automated results

- `npm run build`: passed
- `npm run test:e2e`: passed, `16 passed / 4 conditional skipped`
- Screenshot capture tests: passed, `2 passed`
- Console and page runtime errors: `0`
- Broken images: `0`
- Horizontal and text overflow findings: `0`
- Serious or critical WCAG A/AA findings, excluding separately tracked color contrast: `0`

The conditional skips are the mobile menu case in the desktop project, the desktop geometry case in the mobile project, and two opt-in screenshot capture cases.

### Visual acceptance

The original design is `2880x12912`, normalized to `1440x6456` for its `2x` pixel density. A full-page comparison was performed with animations frozen and local fonts loaded:

- Implementation screenshot: `1440x6456`
- Normalized design: `1440x6456`
- Mean absolute channel difference: `[4.7359, 4.9557, 5.3229] / 255`
- Overall mean absolute difference: `5.0048 / 255`
- Pixels with maximum channel difference above `10`: `5.9220%`
- Pixels with maximum channel difference above `20`: `4.1550%`
- Pixels with maximum channel difference above `50`: `2.9300%`

The desktop design is the static visual acceptance reference. No separate mobile design was provided, so mobile acceptance is based on responsiveness, overflow, interaction, and accessibility checks.

### Acceptance screenshots

- `docs/screenshots/desktop.png` (`1440x6456`)
- `docs/screenshots/mobile.png` (`390x9930`)

### Deployment status

This report covers the local design-match candidate. The existing public Sealos URL still serves the previously validated `v1.0.0` build and has not been overwritten in this iteration. After local human acceptance, build a new immutable GHCR image and update the Sealos Deployment.
