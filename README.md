# 萬里資訊｜標籤機工程師故障排查工具

**Private repository only｜僅供內部工程師使用。**

此專案包含進階診斷、Sensor／線路／量測、零件料號、拆裝、錯誤碼與內部維修案例。**不得把工程師內容同步到 `printer-help-customer` 公開客戶版。**

## v4.0 核心方向

工程師版以「找到根因、完成修復、留下可重用經驗」為目標：

- 客戶原話／錯誤碼／不完整型號快速搜尋。
- 原廠 User Guide、Support、Parts Catalog、Accessories Guide 來源化整理。
- Sensor、Printhead、Platen、Cutter、Motor、PSU、Mainboard、線束等硬體排查。
- A／B 級精確料號分級。
- 萬里內部實機案例與完修案例庫。
- 本機案件紀錄、JSON 備份／還原、根因、處置、零件與完修驗證。
- 大型資料庫分批渲染、完整索引搜尋。
- 工程師工具內可直接查看本機版本、Bundle ID、資料筆數與自檢狀態。
- GitHub Actions 自動 Bundle、Manifest Audit、語法檢查、資料完整性／深度檢查與 cache busting。

## 版本管理

`app-version.js` 是**全站唯一版本來源**：

- `version`：正式版本號。
- `updated`：台灣時間最後更新。
- `timezone`：固定 `Asia/Taipei`。

其他 JS、`index.html`、頁首／頁尾與系統健康面板都只能讀取 `window.APP_BUILD`，不得自行硬編版本號。版本升級時只修改 `app-version.js`。

## 正式執行架構

原始資料仍維持多檔案，方便追來源與修改；瀏覽器正式執行時不再載入數十支 JS。

`bundle-manifest.json` 定義正式來源順序，GitHub Actions 自動產生：

- `dist/repair-data.bundle.js`：型號、來源、維修知識、案例與資料自檢。
- `dist/engineer-app.bundle.js`：版本、搜尋、介面、案件紀錄、案例提交、系統健康與 Smoke Check。
- `dist/engineer.bundle.css`：正式樣式。
- `dist/bundle-meta.json`：Bundle hash、大小、來源數與資料庫摘要。
- `dist/manifest-audit.json`：正式資產是否全部受 Bundle Manifest 管理。
- `dist/kb-stats.json`：資料庫精確筆數、來源數、型號覆蓋、A/B 料號與驗證結果。
- `dist/kb-quality.json`：深度品質稽核、薄弱機型、來源化覆蓋與 advisory。

`index.html` 由建置程序自動維護正式 Bundle 連結與 content hash。**不要手動把原始多支 JS 再加回 `index.html`。**

### 修改資料後

正常流程只修改原始 `.js/.css` → Push 到 `main` → GitHub Actions：

1. 檢查 manifest 是否漏載、缺檔、重複或分組錯誤。
2. 建立 Bundle。
3. 執行嚴格維修資料驗證。
4. 執行深度 KB 品質稽核。
5. `node --check` 驗證兩支 JS Bundle 語法。
6. 產生 `kb-stats.json`、`kb-quality.json`、`bundle-meta.json`。
7. 依正式資產內容產生新的 cache hash。
8. 自動更新 `index.html` 並 commit `dist/`。

工程師電腦只需 GitHub Desktop **Pull** 後開本機 `index.html`。

## 資料可信度規則

### A｜原廠料號

`evidence: 'oem-parts'`

- 來源為原廠 Parts Catalog／Accessories Guide／官方維護文件。
- 正式下料仍需核對 **Model + S/N + DPI + Hardware Revision + Option + 最新替代料號**。

### B｜雙來源料號

`evidence: 'verified-b-parts'` + `verification: 'dual-source'`

只在原廠沒有公開完整 Parts Catalog 時使用：

- 至少 **2 個獨立 B 級來源**必須對同一 P/N 一致。
- 單一零件商資料不得升格為精確料號。
- UI 必須清楚標示 `B｜雙來源料號`，不得假裝是原廠 A 級。
- 下料前仍要回實機再次核對。

### 內部實機案例

- `internal-field`：實機根因已收斂。
- `internal-field-open`：有實測價值，但最終根因尚未完全確認。
- 單台機器量到的 Sensor 值、Pin 電壓等**不可當成通用原廠規格**。

### 通用工程基線

可提供排查順序與隔離方法，但特定 Pin、電壓、阻值、扭力、Service Mode、板件測點仍以該機 **Service Manual** 為最終依據。

## 私人 GitHub 內部案例庫

完修案件先存在工程師本機瀏覽器。案件紀錄可匯出 JSON 備份，換電腦或瀏覽器資料遺失時再匯回。

只有填完整：

- 最終根因／故障零件
- 維修處置
- 完修驗證
- 去識別化案例摘要

才可產生 `wanli-internal-case-v1` 提交包。

提交包會排除客戶名稱、完整序號、工程師姓名與一般備註；工程師把提交包貼給 ChatGPT，由維護流程審核後加入本 private repo。**網頁本身不保存 GitHub Token，也不會自動把未確認案件上傳。**

## 常用維護檔案

- `app-version.js`：**唯一正式版本來源**。
- `bundle-manifest.json`：正式來源載入順序。
- `scripts/manifest-audit.mjs`：Bundle Manifest／版本集中管理檢查。
- `scripts/build-bundles.mjs`：Bundle + 資料驗證 + 統計產生器。
- `scripts/quality-audit.mjs`：資料深度與來源化覆蓋稽核。
- `.github/workflows/build-bundles.yml`：自動建置。
- `catalog.js` / `catalog-legacy-extensions.js`：型號 catalog。
- `repair-kb-core.js` + source extension：資料來源索引。
- `repair-kb-*.js`：維修資料原始文章。
- `internal-case-library.js`：確認後的共用內部案例。
- `kb-integrity-check.js`：瀏覽器執行時資料自檢。
- `app-smoke-check.js`：介面／核心功能啟動檢查。
- `system-health-panel.js`：本機載入狀態、版本與 Bundle 健康資訊。
- `RESEARCH_SOURCES.md`：來源紀錄。
- `dist/kb-stats.json`：**目前資料庫狀態的機器產生 source of truth**。

## 隱私邊界

客戶公開版維護於 `printer-help-customer`。本 repo 的 Service、量測、主板、拆機、內部案例、料號與工程判斷內容不得複製到客戶版。
