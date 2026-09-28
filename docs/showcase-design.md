# cyber-eggs 展示站设计与技术决策

状态：视觉方案已确认，技术草案待实现  
日期：2026-09-28

## 1. 这一阶段要做什么

先完成一个可以本地运行、以后直接发布到 GitHub Pages 的展示站，用少量演示数据验证品牌、页面结构和交互。

本阶段不做：

- 自动收集和核验信息
- 数据库、登录、管理后台
- 服务端 API
- 邮件订阅和推送
- 多语言
- 真实厂商优惠承诺

首版成功标准：陌生人进入首页后，10 秒内理解项目是什么，并能找到、筛选和打开一枚“鸡蛋”。

首屏记忆目标已经确认：

> 这是一个可以捡到 AI 时代“鸡蛋”的地方。

## 2. 页面风格

### 已确认方向：凌晨两点的赛博菜市场

不是常见的蓝紫渐变 AI 官网，也不是复杂数据大屏。视觉上把“超市价签、鸡蛋托、购物小票、LED 数字”与克制的赛博感结合起来。

关键词：

- 黑色电子货架
- 蛋黄黄色价签
- 荧光绿色状态灯
- 米白色小票
- 红色临期印章
- 等宽字体显示额度、日期和限制

建议色板：

```css
--bg: #0b0d0c;
--surface: #151916;
--paper: #f2e8cb;
--yolk: #ffd43b;
--fresh: #78ff90;
--danger: #ff5d52;
--text: #f6f3e8;
--muted: #969d96;
```

字体使用系统字体，不加载第三方字体：

```css
font-family: Inter, ui-sans-serif, system-ui, "PingFang SC", sans-serif;
font-family: "SFMono-Regular", Consolas, monospace;
```

动效只用于状态变化、卡片悬停和首屏轻微扫描线，并尊重 `prefers-reduced-motion`。不用持续闪烁、粒子背景和 WebGL。

### 首屏主视觉（已确认）

首屏采用左右布局：左侧放主标题和行动按钮，右侧是一组用 HTML/CSS 绘制的“赛博鸡蛋货架”。

- 黑色金属货架上放三枚发光鸡蛋。
- 每枚鸡蛋下面挂一张蛋黄色超市价签，分别展示 `500 万 TOKEN`、`每日 100 次`、`开源项目 GRANT` 等 Demo 信息。
- 中间的鲜蛋显示克制的荧光绿呼吸光，表示“现在可领取”。
- 鼠标悬停时鸡蛋只轻微抬起，价签翻亮；不做拖拽、小游戏或复杂 3D。
- 移动端把货架放到文案下方，三枚鸡蛋保持一排并缩小。
- 主视觉全部使用语义化 HTML 和 CSS，不依赖图片、视频、Canvas 或 WebGL。

这组画面要让访客不读说明也能先得到三个信息：这里有鸡蛋、鸡蛋代表免费额度、现在可以捡。

首页高保真概念图：[showcase-homepage-concept.png](./showcase-homepage-concept.png)

> 概念图中的厂商名称、额度和年份仅用于展示布局与视觉层级，不代表真实活动；实际页面开发阶段统一替换为明确标记的虚构 Demo 数据。

### 补充 UI 概念图

- 鸡蛋详情页：[ui/egg-detail-concept.png](./ui/egg-detail-concept.png)
- 移动端首页：[ui/mobile-home-concept.png](./ui/mobile-home-concept.png)
- 卡片状态、搜索空状态、404 与按钮状态：[ui/component-states-concept.png](./ui/component-states-concept.png)

这些图片用于确定布局和视觉规则，不作为页面位图直接使用。开发时使用 HTML/CSS 还原，并统一采用虚构 Demo 数据；图片内的年份或额度文字不作为正式内容。

### 品牌语言

- 项目名：`cyber-eggs / 赛博鸡蛋`
- 首屏主标语：`来这里，捡走 AI 时代的鸡蛋。`
- 首屏解释语：`收集散落在各家厂商里的免费额度，让每个人都能拿到 AI 时代的生产资料。`
- 项目态度：`凌晨两点，去各厂商后台捡鸡蛋。`
- 产品定义：`可验证、可订阅、有保质期的 AI 免费配额雷达。`
- 状态词：`鲜蛋`、`临期`、`待复核`、`臭蛋`
- 操作词：`开始捡蛋`、`立即领取`、`查看蛋源`、`报告臭蛋`

幽默放在标题和状态词中，额度、限制和来源保持严肃、清晰。

### Logo 资产（已确认）

- 文件：[public/logo.png](../public/logo.png)
- 格式：1254 × 1254 RGBA PNG，透明背景
- 用途：GitHub 头像、网站导航、favicon 和社交分享素材
- 图形：蛋黄鸡蛋 + 黑色悬挂价签 + 荧光绿状态灯
- 含义：鸡蛋代表免费 AI 额度，价签代表可领取资源，绿灯代表鲜蛋当前可用
- 色彩：炭黑 `#0B0D0C`、蛋黄黄 `#FFD43B`、鲜绿 `#78FF90`
- 文字策略：图形标不包含文字，网页使用字体排印 `cyber-eggs / 赛博鸡蛋`

生成方式：Codex 内置 ImageGen，透明背景。

最终生成提示词：

```text
Refine the cyber-eggs logo while preserving its egg-plus-hanging-price-tag concept. Remove gloss, gradients, bevels, shadows, texture and pseudo-3D depth. Use flat charcoal black #0B0D0C, yolk yellow #FFD43B and neon green #78FF90. Keep one simplified egg, one hanging supermarket price tag and one clean green availability LED. Centered square mark, crisp silhouette, recognizable at 24–32px, transparent background, no text, no watermark.
```

## 3. 首版信息架构

### 首页 `/`

1. 顶部导航：Logo、全部鸡蛋、项目说明、GitHub。
2. Hero：以“捡 AI 时代的鸡蛋”为唯一记忆点，展示主标语、简介、`开始捡蛋` 和 GitHub 按钮。
3. 数据带：鲜蛋数量、长期免费、即将过期、最后更新日期。
4. 筛选区：搜索、类型、模态、地区、是否需要信用卡。
5. 鸡蛋卡片网格。
6. 可信说明：如何定义鲜蛋、为什么显示核验日期。
7. GitHub CTA：Star、报告问题、参与讨论。
8. 页脚：JSON 数据、RSS、许可证、免责声明。

### 详情页 `/eggs/[id]/`

- 厂商与优惠名称
- 免费额度大字展示
- 适用地区、有效期、刷新周期
- 手机号、信用卡、KYC 等门槛
- 支持的模态
- 简短领取步骤
- 官方领取链接和规则来源
- 最后核验日期
- 报告失效入口

每枚鸡蛋有独立 URL，便于 GitHub、社区和搜索引擎直接分享。

### 鸡蛋卡片

卡片只展示决策所需信息：

- 厂商
- 优惠名称
- 核心额度
- 一次性或周期性
- 鲜度状态
- 地区
- 信用卡/手机号/KYC 标签
- 截止日期或核验日期

不设计虚假的综合评分。用户应看到条件，而不是看不懂的“鸡蛋指数 92 分”。

## 4. 技术栈决策

| 层 | 选择 | 原因 |
| --- | --- | --- |
| 站点生成 | Astro 静态输出 | 内容型站点，页面默认无客户端 JS，可生成详情页和静态数据端点 |
| 语言 | TypeScript | 数据结构和模板可以共用类型 |
| 样式 | 原生 CSS + CSS Variables | 设计独特，不引入 Tailwind 和 UI 组件库 |
| 内容 | Astro Content Collection + JSON | 一枚鸡蛋一个文件，构建时校验字段 |
| 交互 | 少量原生 JavaScript | 搜索和筛选不需要 React/Vue |
| 包管理 | npm | GitHub Actions 和本地环境都原生支持 |
| 校验 | `astro check` + `astro build` | 首版不引入额外测试框架 |
| 托管 | GitHub Pages | 与开源仓库、Actions 和自定义域名自然衔接 |
| 部署 | GitHub Actions | 推送到 `main` 后构建并发布 |

明确不使用：React、Vue、Tailwind、数据库、Serverless、状态管理库、图表库和后端框架。

Astro 官方提供 GitHub Pages Action，可直接构建部署：[Astro GitHub Pages 指南](https://v5.docs.astro.build/en/guides/deploy/github/)。GitHub Pages 也支持 Actions 发布和自定义域名：[GitHub Pages 发布源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 5. 数据模型

展示阶段使用虚构且明确标记为 Demo 的数据，避免把尚未核验的真实优惠发布出去。

```ts
type EggKind = "recurring" | "signup" | "limited" | "grant";
type EggStatus = "fresh" | "expiring" | "stale" | "expired";

interface Egg {
  id: string;
  provider: string;
  title: string;
  summary: string;
  kind: EggKind;
  status: EggStatus;
  quota: {
    label: string;
    reset: "once" | "daily" | "monthly" | "ongoing";
  };
  modalities: Array<"text" | "image" | "audio" | "video" | "embedding">;
  regions: string[];
  requirements: {
    card: boolean | null;
    phone: boolean | null;
    kyc: boolean | null;
  };
  claimUrl: string;
  sourceUrl: string;
  verifiedAt: string;
  expiresAt: string | null;
  featured: boolean;
  demo: boolean;
}
```

`null` 表示未知，不能用 `false` 冒充“无需”。日期统一使用 ISO 8601。

## 6. 数据接口

GitHub Pages 没有动态服务端，首版提供构建时生成的静态接口：

```text
GET /api/v1/eggs.json
GET /api/v1/meta.json
GET /rss.xml
```

`eggs.json` 返回：

```json
{
  "version": "1",
  "generatedAt": "2026-09-28T08:00:00Z",
  "items": []
}
```

规则：

- `/api/v1/` 保持字段向后兼容。
- 页面和接口读取同一个 Content Collection，不维护两份数据。
- 构建失败就不发布，避免坏数据进入站点。
- 首版不提供查询参数；消费者下载 JSON 后自行过滤。
- RSS 从同一数据源生成，不维护独立文章库。

Astro 的静态 endpoint 可以在构建时直接生成 JSON、RSS 等文件：[Astro Endpoints](https://v7.docs.astro.build/en/guides/endpoints/)。

## 7. GitHub 能力组合

| GitHub 能力 | 本项目用途 |
| --- | --- |
| Pages | 托管展示站和静态数据接口 |
| Actions | 检查、构建、部署、以后执行定时数据维护 |
| Issues / Issue Forms | Bug、失效报告、未来的鸡蛋投稿 |
| Discussions | 产品想法、Q&A、厂商专题讨论，不和 Bug 混在一起 |
| Releases | 里程碑和以后每期蛋报 |
| Pull Requests | 数据与代码变更的公开审计记录 |
| Social Preview | GitHub 分享卡片和项目品牌传播 |
| Dependabot | 依赖更新提醒 |

Discussions 适合公开、持续、无需立即落实为任务的讨论；确认要做后再转成 Issue：[GitHub Discussions](https://docs.github.com/en/discussions)。

不依赖 GitHub Models。官方文档显示该产品已于 2026-07-30 完全退役：[GitHub Models](https://docs.github.com/en/github-models)。未来若需要 AI，只通过可替换的外部模型接口在 Actions 中运行。

## 8. 页面与组件边界

首版组件保持少量：

```text
src/components/
  Header.astro
  Hero.astro
  StatsBar.astro
  EggFilters.astro
  EggCard.astro
  TrustSection.astro
  Footer.astro
```

只有出现第二个真实使用场景时才抽取更细组件。Logo 首版使用文字标识和 CSS 鸡蛋符号，不先维护插画系统。

## 9. 首版目录

```text
src/
  components/
  content/eggs/
  layouts/
  pages/
    index.astro
    eggs/[id].astro
    api/v1/eggs.json.ts
    api/v1/meta.json.ts
    rss.xml.ts
  styles/global.css
public/
  favicon.svg
  social-preview.svg
.github/workflows/deploy.yml
astro.config.mjs
package.json
README.md
```

## 10. 实施顺序

1. 建 Astro 静态项目与全局设计变量。
2. 写 6–8 条虚构 Demo 数据和 schema。
3. 完成首页、筛选和鸡蛋卡片。
4. 完成详情页和静态 JSON 接口。
5. 做移动端、键盘操作和 reduced-motion 检查。
6. 补 README、Social Preview 和 GitHub Pages 工作流。
7. 本地构建通过后再创建 GitHub 仓库并发布。

## 11. 已确认决定

- 深色“赛博菜市场”：黑色货架、蛋黄价签、荧光状态灯，不采用企业 SaaS Dashboard 风格。
- 首屏首先建立“这里能捡到 AI 时代鸡蛋”的认知，再解释免费额度、来源和保质期。
- 中文优先，不做 i18n。
- Astro + TypeScript + 原生 CSS。
- 一枚鸡蛋一个 JSON 文件。
- 首页服务端生成，筛选用少量原生 JS。
- 静态 JSON 是数据接口，不做后端。
- 真实优惠收集开始前，只使用明确标记的 Demo 数据。

视觉方向已经确认，后续页面实现以此为基线；其他技术选择先按本文件执行。
