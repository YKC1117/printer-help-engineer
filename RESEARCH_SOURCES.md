# 工程師維修資料庫｜來源紀錄

最後核對：2026-09-07

## 可信度
- **A｜原廠現行文件**：原廠 User Guide、官方 Help、官方產品／支援頁。
- **A｜原廠舊機文件**：停產機型的原廠 User Guide／Support，供現場舊機維修使用。
- **C｜內部現場案例**：實際維修紀錄；可提高某故障方向優先度，但單一量測值不當成所有機台的原廠標準。

## Zebra ZT610 / ZT620
- https://docs.zebra.com/us/en/printers/industrial/zt610-zt620-industrial-printer-with-color-touch-display-user-guide.html
- https://docs.zebra.com/tw/tw/printers/industrial/zt610-zt620-industrial-printer-with-color-touch-di/-zt610-zt620-.html
- https://docs.zebra.com/content/tcm/us/en/printers/software/zpl-pg/zpl-commands/~jg.html
- https://docs.zebra.com/content/tcm/us/en/printers/software/zpl-pg/advanced-techniques/calibration-and-media-feed-commands.html

已整理：Ribbon/Media Calibration、Sensor Profile、Ribbon Out、Media Out、Printhead Pressure、Toggle、走紙偏移、Cutter、Head Open、Temperature、通訊。

## Zebra Xi4：110Xi4 / 140Xi4 / 170Xi4 / 220Xi4
- https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/product/xi4-ug-en.pdf
- https://www.zebra.com/gb/en/support-downloads/printers/industrial/110xi4.html

已整理：Media/Ribbon Calibration、Sensor Profile、Transmissive Sensor、Paper Out、Ribbon Out、Printhead Pressure、Toggle、皺碳、Media Walking。

## TSC TH240 / TH340
- https://fs.tscprinters.com/system/files/31-2250007-00_th240_dh240_user_manual_en_c_0.pdf
- https://usca.tscprinters.com/en/products/th-series-4-inch-durable-desktop-printers

已整理：Sensor Calibration、Print Config、Dump Mode、Print Head Diagnostic、Display Sensor、TSC Console、TPH Care、Cutter Full/Partial Cut、清潔維護。

## TSC MH241 / MH341 / MH641 / MB240T / MB340T
- https://fs.tscprinters.com/system/files/31-1600004-00_mh241_user-manual_tc_a.pdf
- https://usca.tscprinters.com/en/products/mh241-series-4-inch-performance-industrial-printers

已整理：TPH Care、壞點監控、Sensor Calibration、品質與壓力方向。

## Argox P4 Series / P4-650
- https://www.argox.com/tw/products-detail/p4_650/
- https://www.argox.com/docfile/usermanual/P4-Series-User-Manual_V1.9_EN.pdf

已整理：Transmissive/Reflective Sensor、Power-on Calibration、Self Test、Sensor Profile/Offset、TPH Test Pattern、Print Method、Darkness、Speed、Network、錯誤狀態。

## 內部案例使用原則
- 110Xi4 Ribbon Sensor 固定讀值／隔離 Sensor 後行為改善：標示為現場案例，不宣稱該固定數值是所有 110Xi4 的原廠規格。
- P4-650 白色碳帶速度／濃度：僅作特定耗材組合測試基準，不與 Zebra Darkness 數字直接換算。
- 220Xi4 皮帶／固定件影響走偏：保留為診斷線索；正式機構調整仍核對零件圖或 Service Manual，不把永久移除固定件當標準修法。
