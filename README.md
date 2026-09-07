# 萬里資訊｜標籤機工程師排查工具

**Private repository only.**

此專案包含工程師進階診斷、Sensor／線路／量測／指令／拆機與維修判斷內容，不得放入客戶公開網站。

## v3.2 方向
工程師版以「修復完成」為目標，採 **快速症狀排查 + 原廠資料來源化維修知識庫 + 現場案例**。

目前優先補強：
- Zebra Xi4：110Xi4 / 220Xi4 等舊機維修
- Zebra ZT600：ZT610 / ZT620
- TSC：TH240 / TH340、MH241 系列、MB 系列
- Argox：P4 Series / P4-650
- 通用電源、網路、USB、Printhead、Sensor、Cutter 排查

## 主要檔案
- `index.html`：工程師版主頁
- `catalog.js`：品牌／系列／型號資料
- `flows.js`：通用故障流程與既有機型案例
- `engineer-data-plus.js`：額外通用故障流程
- `model-cases-plus.js`：內部現場機型案例
- `repair-kb-core.js`：原廠來源索引
- `repair-kb-zebra.js`：Zebra 深度維修資料
- `repair-kb-tsc.js`：TSC 深度維修資料
- `repair-kb-argox-general.js`：Argox 與通用深度維修資料
- `source-backed-flows.js`：將原廠資料流程套入對應機型／症狀
- `repair-kb-ui.js` / `repair-kb.css`：維修資料庫介面
- `RESEARCH_SOURCES.md`：來源與可信度紀錄
- `app.js`：畫面互動、摘要、案件紀錄

## 資料原則
1. 原廠 User Guide / Support / 官方工具資料優先。
2. 舊機可使用原廠舊版 User Guide / Support。
3. 現場案例標示為經驗線索，不把單一機器量測值誤當所有機型標準。
4. 特定 Pin、電壓、機構拆裝、零件規格仍以對應 Service Manual 為最終依據。
5. 客戶公開版請維護在 `printer-help-customer`，工程師內容不得混入客戶版。
