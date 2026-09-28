# cyber-eggs / 赛博鸡蛋

> 来这里，捡走 AI 时代的鸡蛋。

`cyber-eggs` 是一个可验证、可订阅、有保质期的 AI 免费配额雷达。当前仓库处于展示站骨架阶段，只包含虚构 Demo 数据。

## 本地运行

要求：Node.js 24+、npm 9.6.5+。

```bash
npm install
npm run dev
```

默认访问：<http://localhost:4321>

## 验证

```bash
npm run validate
npm audit --audit-level=high
```

## 当前能力

- Astro 静态站点骨架
- JSON 数据 schema 与构建时校验
- 首页、详情页、404
- 静态 `/api/v1/eggs.json`、`/api/v1/meta.json`、`/rss.xml`
- 原生 JavaScript 搜索与筛选
- GitHub Actions CI

## 反馈与讨论

- 发现界面问题（布局错乱、交互异常）：提交 [界面问题](https://github.com/xiangmingAI/cyber-eggs/issues/new?template=ui-issue.yml)
- 对功能或内容有建议：提交 [功能建议](https://github.com/xiangmingAI/cyber-eggs/issues/new?template=feature-suggestion.yml)
- 产品想法、Q&A 和开放讨论：去 [Discussions](https://github.com/xiangmingAI/cyber-eggs/discussions)
- 鸡蛋投稿（真实优惠）：暂未开放，将在数据收集阶段提供独立表单

## 继续开发

先阅读：

1. [`docs/showcase-design.md`](docs/showcase-design.md)：视觉与产品决策。
2. [`docs/IMPLEMENTATION_PLAYBOOK.md`](docs/IMPLEMENTATION_PLAYBOOK.md)：按任务编号执行的开发与验证手册。
3. [`AGENTS.md`](AGENTS.md)：AI 开发约束。

## 重要说明

`src/data/eggs/` 中的数据全部是演示数据，不代表任何厂商的真实优惠。真实数据收集与自动维护不属于当前阶段。
