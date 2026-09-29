import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const baseToken = process.env.FEISHU_BASE_TOKEN;
const tableId = process.env.FEISHU_TABLE_ID;
const viewId = process.env.FEISHU_VIEW_ID;
const appId = process.env.FEISHU_APP_ID;
const appSecret = process.env.FEISHU_APP_SECRET;
const recordsFile = process.env.FEISHU_RECORDS_FILE;
const outputDir = resolve(process.env.FEISHU_OUTPUT_DIR ?? "src/data/eggs");
const apiBase = process.env.FEISHU_API_BASE ?? "https://open.feishu.cn";
const syncDate = process.env.SYNC_DATE ?? new Date().toISOString().slice(0, 10);

if (!recordsFile && (!baseToken || !tableId || !appId || !appSecret)) {
  throw new Error("Set FEISHU_APP_ID, FEISHU_APP_SECRET, FEISHU_BASE_TOKEN, and FEISHU_TABLE_ID, or provide FEISHU_RECORDS_FILE.");
}

const asArray = (value) => {
  if (value == null || value === "") return [];
  return Array.isArray(value) ? value : [value];
};

const text = (value) => {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join(", ");
  if (typeof value === "object") return text(value.text ?? value.value ?? value.name ?? value.link);
  return String(value).trim();
};

const url = (value) => {
  const candidate = text(value);
  const match = candidate.match(/https?:\/\/[^\s)]+/);
  return (match?.[0] ?? candidate).replace(/[.,;]+$/, "");
};

const option = (value, fallback) => text(asArray(value)[0]) || fallback;

const boolOption = (value) => {
  const normalized = option(value, "未知");
  if (normalized === "是") return true;
  if (normalized === "否") return false;
  return null;
};

const dateParts = (value) => {
  if (typeof value === "number") return new Date(value);
  const candidate = text(value);
  if (!candidate) return null;
  const parsed = new Date(candidate.replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const localDate = (value, fallback = syncDate) => {
  const parsed = dateParts(value);
  if (!parsed) return fallback;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
};

const slugify = (value) => text(value)
  .toLowerCase()
  .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 90) || "egg";

const getField = (fields, name) => fields[name];

function fromCliMatrix(payload) {
  const fields = payload?.data?.fields ?? [];
  return (payload?.data?.data ?? []).map((row, index) => ({
    record_id: payload?.data?.record_id_list?.[index],
    fields: Object.fromEntries(fields.map((field, fieldIndex) => [field, row[fieldIndex]])),
  }));
}

async function fetchRecords() {
  if (recordsFile) {
    const payload = JSON.parse(await readFile(resolve(recordsFile), "utf8"));
    return Array.isArray(payload) ? payload : payload?.data?.items ?? fromCliMatrix(payload);
  }

  const tokenResponse = await fetch(`${apiBase}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  const tokenPayload = await tokenResponse.json();
  if (!tokenResponse.ok || tokenPayload.code !== 0 || !tokenPayload.tenant_access_token) {
    throw new Error(`Feishu token request failed: ${JSON.stringify(tokenPayload)}`);
  }

  const records = [];
  let pageToken = "";
  do {
    const query = new URLSearchParams({ page_size: "500" });
    if (viewId) query.set("view_id", viewId);
    if (pageToken) query.set("page_token", pageToken);
    const response = await fetch(`${apiBase}/open-apis/bitable/v1/apps/${encodeURIComponent(baseToken)}/tables/${encodeURIComponent(tableId)}/records?${query}`, {
      headers: { Authorization: `Bearer ${tokenPayload.tenant_access_token}` },
    });
    const payload = await response.json();
    if (!response.ok || payload.code !== 0) {
      throw new Error(`Feishu records request failed: ${JSON.stringify(payload)}`);
    }
    records.push(...(payload.data?.items ?? []));
    pageToken = payload.data?.has_more ? payload.data.page_token : "";
  } while (pageToken);
  return records;
}

function toEgg(record) {
  const fields = record.fields ?? {};
  const reviewStatus = option(getField(fields, "审核状态"), "candidate");
  const websiteStatus = option(getField(fields, "网站状态"), "fresh");
  if (!["approved", "published"].includes(reviewStatus) || websiteStatus === "expired") return null;

  const eggId = text(getField(fields, "EggID"));
  const title = text(getField(fields, "标题"));
  const sourceUrl = url(getField(fields, "来源地址"));
  const claimUrl = url(getField(fields, "领取地址")) || sourceUrl;
  if (!eggId || !title || !sourceUrl || !claimUrl) return null;

  const steps = text(getField(fields, "领取步骤"))
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter(Boolean)
    .slice(0, 5);

  return {
    id: slugify(eggId),
    provider: text(getField(fields, "服务商")) || "待确认",
    title,
    summary: text(getField(fields, "摘要")) || "请打开来源查看最新领取规则。",
    kind: option(getField(fields, "类型"), "limited"),
    status: websiteStatus,
    quota: {
      label: text(getField(fields, "额度说明")) || "待确认",
      reset: option(getField(fields, "额度重置"), "ongoing"),
    },
    modalities: asArray(getField(fields, "能力类型")).map(text).filter(Boolean),
    regions: asArray(getField(fields, "地区")).map(text).filter(Boolean),
    requirements: {
      card: boolOption(getField(fields, "需要信用卡")),
      phone: boolOption(getField(fields, "需要手机号")),
      kyc: boolOption(getField(fields, "需要 KYC")),
    },
    claimUrl,
    sourceUrl,
    verifiedAt: localDate(getField(fields, "核验时间")),
    expiresAt: text(getField(fields, "过期时间")) ? localDate(getField(fields, "过期时间")) : null,
    featured: false,
    demo: false,
    steps: steps.length ? steps : ["打开来源并确认最新领取规则"],
    collection: {
      eggId,
      recordId: text(record.record_id),
      sourceType: option(getField(fields, "来源类型"), "其他"),
      syncedAt: syncDate,
    },
  };
}

const records = await fetchRecords();
const eggs = records.map(toEgg).filter(Boolean);
if (!eggs.length) throw new Error("No approved, non-expired records found in the Feishu publish view.");

await mkdir(outputDir, { recursive: true });
for (const filename of await readdir(outputDir)) {
  if (filename.endsWith(".json")) await rm(join(outputDir, filename));
}
for (const egg of eggs) {
  await writeFile(join(outputDir, `${egg.id}.json`), `${JSON.stringify(egg, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({ synced: eggs.length, outputDir, ids: eggs.map((egg) => egg.id) }, null, 2));
