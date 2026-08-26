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
- 本地 `npm run test:e2e`: 通过，`16 passed / 4 conditional skipped`
- GitHub Actions CI: 通过，[run 32923866368](https://github.com/Tony-XUYANG/sealos-brain-ui/actions/runs/32923866368)
- 公网 Playwright 与截图验收: 通过，`18 passed / 2 viewport-specific skipped`
- 控制台错误与页面运行时错误: `0`
- 断图: `0`
- 横向溢出与文字溢出: `0`
- WCAG A/AA 严重或致命问题（不含单独跟踪的颜色对比度）: `0`

本地条件跳过项为桌面项目中的移动菜单用例、移动项目中的桌面几何用例，以及默认关闭的两条截图采集用例。公网验收启用了截图采集，因此仅跳过两条视口不适用用例。

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

- 公网地址: https://sealos-brain-ui-dinkkees.sealoshzh.site
- Deployment: `sealos-brain-ui-uelrpqvt`，`1/1 Ready`，Pod 重启 `0`
- 镜像: `ghcr.io/tony-xuyang/sealos-brain-ui:20260826-104517`
- 镜像 digest: `sha256:8dc15135c7823e254dc865da2c8cfcf99000c97f4dc8908a5ac278167fdccef8`
- GHCR 匿名 manifest: `HTTP 200`，包含 `linux/amd64`
- Launchpad 公网检查: `ok: true`，Service 端口 `8080`，域名一致
- HTTP: `/` 为 `200`，`/healthz` 为 `200`，随机路径为 `404`
- 稳定窗口: `144` 秒，活动失败事件 `0`，重启增量 `0`，Pod 未替换，Ready 转换未变化

机器可读证据保存在 `deploy/runtime/`。

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
- Local `npm run test:e2e`: passed, `16 passed / 4 conditional skipped`
- GitHub Actions CI: passed, [run 32923866368](https://github.com/Tony-XUYANG/sealos-brain-ui/actions/runs/32923866368)
- Public Playwright and screenshot acceptance: passed, `18 passed / 2 viewport-specific skipped`
- Console and page runtime errors: `0`
- Broken images: `0`
- Horizontal and text overflow findings: `0`
- Serious or critical WCAG A/AA findings, excluding separately tracked color contrast: `0`

The local conditional skips are the mobile-menu case in the desktop project, the desktop-geometry case in the mobile project, and two opt-in screenshot cases. Public acceptance enabled screenshot capture, leaving only the two viewport-inapplicable cases skipped.

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

- Public URL: https://sealos-brain-ui-dinkkees.sealoshzh.site
- Deployment: `sealos-brain-ui-uelrpqvt`, `1/1 Ready`, Pod restarts `0`
- Image: `ghcr.io/tony-xuyang/sealos-brain-ui:20260826-104517`
- Image digest: `sha256:8dc15135c7823e254dc865da2c8cfcf99000c97f4dc8908a5ac278167fdccef8`
- Anonymous GHCR manifest: `HTTP 200`, including `linux/amd64`
- Launchpad public-network check: `ok: true`, Service port `8080`, matching host
- HTTP: `/` returned `200`, `/healthz` returned `200`, and a random path returned `404`
- Stability window: `144` seconds, active failures `0`, restart delta `0`, no Pod replacement, and no Ready transition change

Machine-readable evidence is stored in `deploy/runtime/`.
