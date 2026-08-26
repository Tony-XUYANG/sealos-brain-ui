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
- 平均绝对通道差: `[4.8648, 4.9812, 5.5819] / 255`
- 总体平均绝对差: `5.1426 / 255`
- 最大通道差超过 `10` 的像素: `5.9858%`
- 最大通道差超过 `20` 的像素: `4.2539%`
- 最大通道差超过 `50` 的像素: `2.9382%`

新增局部参考图验收：AI Proxy 的 `412x313` 归一化裁切平均绝对差从 `4.6420` 降至 `2.2936 / 255`，RMSE 从 `20.1296` 降至 `12.7329`。Deploy 区域按新标注取消 Cloud 卡片底部裁切；这项新要求覆盖整页旧设计稿中被裁切的状态，因此整页均差有小幅变化。

桌面端设计稿是静态视觉验收基准。移动端没有单独设计稿，因此采用响应式、溢出、交互和可访问性验收。

### 验收截图

- `docs/screenshots/desktop.png` (`1440x6456`)
- `docs/screenshots/mobile.png` (`390x9930`)

### 部署状态

- 公网地址: https://sealos-brain-ui-dinkkees.sealoshzh.site
- Deployment: `sealos-brain-ui-uelrpqvt`，`1/1 Ready`，Pod 重启 `0`
- 镜像: `ghcr.io/tony-xuyang/sealos-brain-ui:20260826-115114`
- 镜像 digest: `sha256:69eedd20a5f14a329ca0ebf7a46a0d9fe8da6d09ee3e3152355fda93ef18b0d6`
- GHCR 匿名 manifest: `HTTP 200`，包含 `linux/amd64`
- Launchpad 公网检查: `ok: true`，Service 端口 `8080`，域名一致
- HTTP: `/` 为 `200`，`/healthz` 为 `200`，随机路径为 `404`
- 稳定窗口: `152` 秒，活动失败事件 `0`，重启增量 `0`，Pod 未替换，Ready 转换未变化；旧 Pod 的一次 readiness 超时未增长，归类为历史瞬态

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
- Mean absolute channel difference: `[4.8648, 4.9812, 5.5819] / 255`
- Overall mean absolute difference: `5.1426 / 255`
- Pixels with maximum channel difference above `10`: `5.9858%`
- Pixels with maximum channel difference above `20`: `4.2539%`
- Pixels with maximum channel difference above `50`: `2.9382%`

New detail-reference acceptance: the normalized `412x313` AI Proxy crop improved from `4.6420` to `2.2936 / 255` mean absolute difference, with RMSE reduced from `20.1296` to `12.7329`. The Deploy detail now keeps the Cloud card bottom visible as requested; this newer annotation supersedes the clipped state in the original full-page baseline, so the full-page mean changes slightly.

The desktop design is the static visual acceptance reference. No separate mobile design was provided, so mobile acceptance is based on responsiveness, overflow, interaction, and accessibility checks.

### Acceptance screenshots

- `docs/screenshots/desktop.png` (`1440x6456`)
- `docs/screenshots/mobile.png` (`390x9930`)

### Deployment status

- Public URL: https://sealos-brain-ui-dinkkees.sealoshzh.site
- Deployment: `sealos-brain-ui-uelrpqvt`, `1/1 Ready`, Pod restarts `0`
- Image: `ghcr.io/tony-xuyang/sealos-brain-ui:20260826-115114`
- Image digest: `sha256:69eedd20a5f14a329ca0ebf7a46a0d9fe8da6d09ee3e3152355fda93ef18b0d6`
- Anonymous GHCR manifest: `HTTP 200`, including `linux/amd64`
- Launchpad public-network check: `ok: true`, Service port `8080`, matching host
- HTTP: `/` returned `200`, `/healthz` returned `200`, and a random path returned `404`
- Stability window: `152` seconds, active failures `0`, restart delta `0`, no Pod replacement, and no Ready transition change; one old-Pod readiness timeout did not advance and is classified as historical transient

Machine-readable evidence is stored in `deploy/runtime/`.
