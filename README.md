# cyber-eggs / 赛博鸡蛋

> 来这里，捡走 AI 时代的鸡蛋。

`cyber-eggs` 是一个可验证、可订阅、有保质期的 AI 免费配额雷达。网站只展示飞书「网站发布」视图中已人工审核的记录。

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

## 数据收集链路

真实数据收集已抽离为同级独立服务 `../cyber-eggs-collector/`。服务把微信公众号、Linux.do 和 RSS/Atom 统一成候选，使用 Crawl4AI 或 OpenCLI 补全文本，再经过去重、证据评分和人工批准。GitHub Actions 只拉取飞书「网站发布」视图，不会发布候选池或待审核数据。

```bash
cd ../cyber-eggs-collector
python3 -m cyber_eggs_collector discover
python3 -m cyber_eggs_collector enrich
python3 -m cyber_eggs_collector queue
```

完整配置、HTTP API、复核门槛和公众号/Linux.do 前置条件见 [`../cyber-eggs-collector/README.md`](../cyber-eggs-collector/README.md)。

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

## 飞书同步

本地手动同步：

```bash
export FEISHU_APP_ID='...'
export FEISHU_APP_SECRET='...'
export FEISHU_BASE_TOKEN='RB7DbeYrYaAZadsQCO9ckeZZn0f'
export FEISHU_TABLE_ID='tblyCwm1EBd3ZKss'
export FEISHU_VIEW_ID='vewMl6GpOs'
node scripts/sync-feishu.mjs
npm run validate
```

GitHub Actions 使用同名 Repository Secrets，工作流 `.github/workflows/sync-feishu.yml` 默认每小时同步一次，也支持手动触发。

## 重要说明

`src/data/eggs/` 中只应出现飞书「网站发布」视图同步出的数据；未审核候选不会进入网站。领取前仍需自行核对服务商页面、额度、地区、有效期和服务条款。
